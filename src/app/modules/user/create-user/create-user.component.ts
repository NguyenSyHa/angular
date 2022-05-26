import { Component, OnInit, Injector, Inject } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { RoleDto, UserDto } from '@shared/service-proxies/service-proxies';
import { MatCheckboxChange, MAT_DIALOG_DATA, MatDialogRef, MAT_DATE_LOCALE } from '@angular/material';
import * as _ from 'lodash';
import { UserService } from '@app/service/api/user.service';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { UserForManager } from '../user.component';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CreateUserComponent extends AppComponentBase implements OnInit {

  activeRandom = true;
  shPassword = false;
  shConfirmPassword = false;
  confirmPassword = '';
  confirmDisale = false;
  title = '';
  saving = false;
  ischeck = false;
  user = {} as createUserDTO;
  roles: RoleDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  isLoadingAvatarUpload: boolean = false;
  listLevelFiltered = [];
  startDate: FormControl = new FormControl();
  salaryDate: FormControl = new FormControl();
  managerSearch: FormControl = new FormControl();
  users;
  sexes;
  managers: UserForManager[];
  managersFiltered: UserForManager[];
  respone = 1;
  userGot;
  enableNormalLogin = AppConsts.enableNormalLogin;

  userId: number;

  isSaving: boolean = false;

  constructor(
    injector: Injector,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private diaLogRef: MatDialogRef<CreateUserComponent>,
    private userService: UserService
  ) {
    super(injector);
    this.userId = data.userId;
    this.sexes = data.sexes;
    this.listLevelFiltered = this.userLevels.slice();
    this.managers = data.userss;
    this.managerSearch.setValue("");
    this.managerSearch.valueChanges.subscribe(() => {
      this.filterManagers();
    });

  }

  ngOnInit(): void {
    if (!this.userId) {
      this.title = 'Create new User';
      this.randomPassword();
      this.checkedRolesMap['BASICUSER'] = true;
      this.user.roleNames = ['BASICUSER'];
      this.user.isActive = true;
      this.user.allowedLeaveDay = 0;
      this.user.branch = this.appSession.user.branch != null ? this.appSession.user.branch : 0;
      this.managersFiltered = this.managers.slice();
      this.userService.getRoles().subscribe(data => {
        this.roles = data.result.items;
        this.setInitialRolesStatus();
      });
    } else {
      this.userService.getById(this.userId).subscribe(result => {
        this.user = result.result;
        this.title = 'Edit User ' + this.user.userName;
        this.managersFiltered = this.managers.slice();
        this.userService.getRoles().subscribe(data => {
          this.roles = data.result.items;
          this.setInitialRolesStatus();
        });
      });
    }
  }
  onEmailChange(): void {
    if (this.user.emailAddress) {
      if (this.user.emailAddress.endsWith(".ncc@gmail.com")) {
        this.user.type = this.UserType.Intern;
        this.onUserTypeChange();
      } else {
        if (this.user.emailAddress.endsWith("ncc.asia")) {
          this.user.type = this.UserType.Staff;
          this.onUserTypeChange();
        } else {
          this.user.type = null;
        }
      }
    }
  }

  onUserTypeChange(): void {
    console.log('onUserTypeChange', this.user.type);
    if (this.user.type == null) {
      this.listLevelFiltered = this.userLevels.slice();
    } else if (this.user.type == this.UserType.Intern) {
      this.listLevelFiltered = this.userLevels.slice(0, 4);
    } else {
      this.listLevelFiltered = this.userLevels.slice(4, this.userLevels.length);
    }
    if (!this.listLevelFiltered.find(s => s.value == this.user.level)) {
      this.user.level = null;
      this.onLevelChange();
    }
    //
  }

  onLevelChange(): void {
    console.log('onLevelChange', this.user.level);
    if (this.user.level == null) {
      this.user.salary = 0;
      return;
    }
    if (this.user.level == this.Level.Intern_0) {
      this.user.salary = 75000;
    } else if (this.user.level == this.Level.Intern_600K) {
      this.user.salary = 675000;
    } else if (this.user.level == this.Level.Intern_2M) {
      this.user.salary = 2675000;
    } else if (this.user.level == this.Level.Intern_4M) {
      this.user.salary = 4675000;
    }

    if (this.user.type == this.UserType.Intern && this.user.level > this.Level.Intern_0) {
      this.user.salaryAt = moment().add(1, 'M').startOf("M").toISOString();
    }

  }


  setInitialRolesStatus(): void {
    if (this.user.id != null) {
      this.user.roleNames = _.map(this.user.roleNames, (o) => { return o.toUpperCase() });
    }
    _.map(this.roles, item => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(item.normalizedName);
    });
  }
  isRoleChecked(val: string): boolean {
    return _.includes(this.user.roleNames, val);
  }

  onRoleChange(role: RoleDto, $event: MatCheckboxChange) {
    this.checkedRolesMap[role.normalizedName] = $event.checked;
    this.user.roleNames = this.getCheckedRoles();
    this.ischeck = this.user.roleNames.length === 0;
  }

  filterManagers(): void {
    if (this.managerSearch.value) {
      var temp: string = this.managerSearch.value.toLowerCase().trim();
      this.managersFiltered = this.managers.filter(data => data.name.toLowerCase().includes(temp));
    } else this.managersFiltered = this.managers.slice();
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _.forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  randomPassword() {
    let passRandom = Math.random()
      .toString(36)
      .substr(2, 10);

    this.user.password = passRandom;
    this.confirmPassword = this.user.password;
    this.reactChangePassword(true);
  }
  backField(val) {
    if (val === '') {
      this.confirmPassword = '';
      this.reactChangePassword(false);
    }
  }
  reactChangePassword(val: boolean) {
    this.confirmDisale = val;
    this.shPassword = val;
  }

  getManagerId(): number {
    var temp = _.pick(this.users, ["userManager"]);
    if (temp.userManager == null || temp.userManager.length == 0) {
      return 0;
    } else return temp.userManager[0].managerId;
  }

  save(): void {
    this.isSaving = true;
    if (this.user.salary == null) {
      this.user.salary = 0;
    }
    this.user.startDateAt = this.user.startDateAt ? moment(this.user.startDateAt).add(7, 'h').toISOString() : this.user.startDateAt;

    this.user.salaryAt = this.user.salaryAt ? moment(this.user.salaryAt).add(7, 'h').toISOString() : this.user.salaryAt;

    if (isNaN(this.user.allowedLeaveDay)) {
      abp.message.error(this.l("Allowed Leaveday must be a number!"));
      return;
    }

    if (this.user.allowedLeaveDay < 0) {
      abp.message.error(this.l("Allowed Leaveday can't be negative!"))
      return;
    }

    if (this.user.allowedLeaveDay == null || !this.user.allowedLeaveDay) {
      this.user.allowedLeaveDay = 0;
    }
    if (!this.user.id) {
      this.userService.create(this.user).subscribe(data => {
        if (data) {
          this.notify.success(this.l("Create User Successfully!"));
          this.close(true);
          this.isSaving = false;
        }
      },
        err => {
          this.isSaving = false;
        });
    } else {
      this.userService.update(this.user).subscribe(data => {
        if (data.success) {
          this.notify.success(this.l("Edit User Successfully!"));
          this.close(true);
          this.isSaving = false;
        }
      },
        err => {
          this.isSaving = false;
        }
      );
    }

  }

  close(isCloseDialog): void {
    this.diaLogRef.close(isCloseDialog);
  }

}

export class createUserDTO {
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  roleNames: string[];
  password: string;
  type: number;
  jobTitle: string;
  level: number;
  registerWorkDay: string;
  allowedLeaveDay: number;
  startDateAt: any;
  salary: number;
  salaryAt: string;
  sex: number;
  userCode: string;
  managerId: number;
  branch: any;
  id: number
}