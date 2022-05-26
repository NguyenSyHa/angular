import { AppConsts } from './../../../shared/AppConsts';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto, FilterDto } from '@shared/paged-listing-component-base';
import { UserService } from '@app/service/api/user.service';
import { finalize } from 'rxjs/operators';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { CreateUserComponent } from './create-user/create-user.component';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ResetPasswordDialogComponent } from '@app/users/reset-password/reset-password.component';
import * as _ from 'lodash';
import { UploadAvatarComponent } from './upload-avatar/upload-avatar.component';
import * as moment from 'moment';
import { PERMISSIONS_CONSTANT } from '@app/constant/permission.constant';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [DatePipe, CurrencyPipe]
})
export class UserSecondComponent extends PagedListingComponentBase<userDTO> implements OnInit {
  ADD_USER = PERMISSIONS_CONSTANT.AddUser;
  EDIT_USER = PERMISSIONS_CONSTANT.EditUser;
  DELETE_USER = PERMISSIONS_CONSTANT.DeleteUser;
  CHANGE_STATUS_USER = PERMISSIONS_CONSTANT.ChangeStatusUser;
  RESET_PASSWORD = PERMISSIONS_CONSTANT.ResetPassword;
  UPLOAD_AVATAR = PERMISSIONS_CONSTANT.UploadAvatar;

  enableExpandName = true;
  isLoadingFileUpload: boolean;
  isActive;
  managerId;
  expand = true;
  managers: Manager[] = [];
  userType;
  level;
  keyword;
  branch;
  sexes = [
    { value: 0, label: 'Male', class: 'bg-red label status-label' },
    { value: 1, label: 'Female', class: 'bg-green label status-label' }
  ];
  users: userDTO[];
  showHeader = false;
  turnOffPermission = false;
  ProjectUserType = ProjectUserType;
  usersNotPagging: UserForManager[];
  filterItems: FilterDto[] = [];
  @ViewChild(MatMenuTrigger)
  actionsMenu1: MatMenuTrigger;
  tableHeader = [
    { name: 'Check All', value: true, fieldName: 'checkAll' },
    { name: 'User', value: true, fieldName: 'user' },
    { name: 'Branch', value: true, fieldName: 'branch' },
    { name: 'Start Date', value: true, fieldName: 'sd' },
    { name: 'Allowed Leaveday', value: true, fieldName: 'allowedLeaveday' },
    { name: 'Type', value: true, fieldName: 'type' },
    { name: 'Level', value: true, fieldName: 'level' },
    { name: 'Projects', value: true, fieldName: 'project' },
    { name: 'Salary', value: true, fieldName: 'salary' },
    { name: 'Salary At', value: true, fieldName: 'salaryAt' },
    { name: 'Register Workday', value: true, fieldName: 'registerWorkday' },
    { name: 'Sex', value: true, fieldName: 'sex' },
    { name: 'Manager', value: true, fieldName: 'manager' },
    { name: 'Roles', value: true, fieldName: 'role' },
    { name: 'Creation Time', value: true, fieldName: 'createTime' },
    { name: 'Is Active', value: true, fieldName: 'isActive' },
  ];
  contextMenuPosition = { x: '0px', y: '0px' };

  scrollbarPosition = 0;
  scrollingValue = 200;

  userTypes = [
    { value: 0, label: 'Staff' },
    { value: 1, label: 'Internship' },
    { value: 2, label: 'Collaborator' }
  ];

  isExpandUserName = false;

  onContextMenu(event: MouseEvent, temp) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    temp.openMenu();
  }
  constructor(
    injector: Injector,
    private userService: UserService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private currency: CurrencyPipe
  ) {
    super(injector);
    this.isActive = '1';
    this.userType = '100';
    this.level = '100';
    this.managerId = '-1';
    this.branch = this.appSession.user.branch != null ? this.appSession.user.branch + '' : '100';
    const tblHeader = this.getLocal('tableHeader');
    if (tblHeader) {
      if (tblHeader.length < this.tableHeader.length) {
        this.setLocal('tableHeader', this.tableHeader);
      } else {
        this.tableHeader = tblHeader;
      }
    } else {
      this.setLocal('tableHeader', this.tableHeader);
    }

    this.userService.getAllNotPagging().subscribe(data => {
      this.usersNotPagging = data.result.filter(res => res.type == 0);
    });
    this.userService.getAllManager().subscribe(data => {
      this.managers = data.result;
    });
  }

  public getLocal(name: string) {
    return JSON.parse(localStorage.getItem(name));
  }
  public setLocal(name: string, value: any): void {
    localStorage.setItem(name, JSON.stringify(value));
  }

  toNumber(str: string): any {
    return +str;
  }

  showOrHideHeader(): void {
    this.showHeader = !this.showHeader;
    if (this.showHeader) {
      this.turnOffPermission = false;
    }
  }
  getAll() {
    this.userService.getAll().subscribe(data => {


    })
  }
  turnOff(): void {
    if (this.turnOffPermission) {
      this.showHeader = false;
    }
    this.turnOffPermission = true;
  }

  changSelection(item): void {
    if (item.fieldName == 'checkAll') {
      this.tableHeader.forEach(e => {
        e.value = item.value;
      });
    } else {
      this.tableHeader[0].value = this.tableHeader.slice(1, this.tableHeader.length).some(h => h.value == false) ? false : true;
    }
    this.setLocal('tableHeader', this.tableHeader);
    let num = 0;
    this.tableHeader.forEach(s => {
      if (s.value) {
        num++;
      }
    });
    if (num > 8) {
      this.enableExpandName = true;
    } else {
      this.enableExpandName = false;
      this.isExpandUserName = false;
      this.users.forEach(s => {
        s.expandMgName = false;
      });
    }
  }

  protected list(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    if (this.keyword) {
      request.searchText = this.keyword.trim();
    }
    this.removeFilterItem();
    if (this.isActive != null && this.isActive < 100) {
      this.addFilterItem('isActive', this.toNumber(this.isActive));
    }
    if (this.userType != null && this.userType < 100) {
      this.addFilterItem('type', this.toNumber(this.userType));
    }
    if (this.level != null && this.level < 100) {
      this.addFilterItem('level', this.toNumber(this.level));
    }
    if (this.managerId != null && this.managerId != -1) {
      this.addFilterItem('managerId', this.toNumber(this.managerId));
    }
    if (this.branch != null && this.branch < 100) {
      this.addFilterItem('branch', this.toNumber(this.branch));
    }
    request.filterItems = this.filterItems;
    this.userService
      .getAllPagging(request)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: any) => {
        this.users = result.result.items;
        _.map(this.users, (u) => {          
          if (u.salary) {
            u.salary = this.currency.transform(u.salary, "", "", "0.0-0", "").replace(/\u00a0/g, ".");
            u.salary = u.salary.slice(0, u.salary.length - 1);
          }
          
          if (u.startDateAt) {
            u.startDateAt = this.datePipe.transform(new Date(u.startDateAt), 'dd/MM/yyyy');
          }
          if (u.salaryAt) {
            if (u.type == this.UserType.Intern && u.level >= this.Level.Intern_600K) {
              u.isLevelUp = moment(u.salaryAt).get('M') === moment().get('M');
            } else {
              u.isLevelUp = false;
            }

            u.salaryAt = this.datePipe.transform(new Date(u.salaryAt), 'dd/MM/yyyy');

          }
          
          if (u.avatarPath) {            
            u.avatarPath = AppConsts.remoteServiceBaseUrl + u.avatarPath;
          }
          
          if (u.creationTime) {
            // u.creationTime = moment(u.creationTime).tz('Asia/Ho_Chi_Minh').format("DD/MM/YYYY HH:mm:ss");
            u.creationTime = moment(u.creationTime).format('DD/MM/YYYY HH:mm:ss');
          }
          if (!u.avatarPath) {
            switch (u.sex) {
              case 0: {
                u.avatarPath = 'assets/images/men.png';
                break;
              }
              case 1: {
                u.avatarPath = 'assets/images/women.png';
                break;
              }
              default: u.avatarPath = 'assets/images/undefine.png';
                break;
            }
          }
          if (u.managerAvatarPath && u.managerAvatarPath != '/avatars/') {
            u.managerAvatarPath = AppConsts.remoteServiceBaseUrl + u.managerAvatarPath;
          } else {
            if (u.managerId) {
              u.managerAvatarPath = 'assets/images/undefine.png';
            }
          }
        });
        this.showPaging(result.result, pageNumber);
      });
  }

  removeFilterItem(): void {
    this.filterItems = [];
  }

  addFilterItem(str, num): void {
    this.filterItems.push({ comparison: 0, propertyName: str, value: num });
  }

  protected delete(user): void {
    abp.message.confirm(this.l('Delete This User?'),
      (result: boolean) => {
        if (result) {
          this.userService.delete(user.id).subscribe(res => {
            if (res) {
              this.notify.success(this.l('Delete User Successfully!'));
              this.refresh();
            }
          });
        }
      }
    );
  }

  searchOrFilter(): void {
    this.refresh();
  }

  createOrEdit(editUser?): void {

    let userId = editUser ? editUser.id : null;
    let diaLogRef = this.dialog.open(CreateUserComponent, {
      disableClose: true,
      data: { userId: userId, userss: this.usersNotPagging, sexes: this.sexes }
    });

    diaLogRef.afterClosed().subscribe(res => {
      if (res) {
        this.refresh();
      }
    });
  }

  showResetPasswordUserDialog(userId?: number): void {
    let diaLofRef = this.dialog.open(ResetPasswordDialogComponent, {
      data: userId
    });
    diaLofRef.afterClosed().subscribe(() => this.refresh());
  }

  deactivateUser(id: number) {
    abp.message.confirm(this.l('Deactivate this user?'),
      (result: boolean) => {
        if (result) {
          this.userService.deactivateUser(id).subscribe(res => {
            if (res) {
              this.notify.success(this.l('Deactivated User Successfully!'));
              this.refresh();
            }
          });
        }
      }
    );
  }

  upLoadAvatar(user): void {
    let diaLogRef = this.dialog.open(UploadAvatarComponent, {
      width: '600px',
      data: user.id
    });
    diaLogRef.afterClosed().subscribe(res => {
      if (res) {
        this.userService.uploadImageFile(res, user.id).subscribe(data => {
          if (data) {
            this.notify.success('Upload Avatar Successfully!');
            if (this.appSession.user.id == user.id) {
              this.appSession.user.avatarPath = data.body.result;
            }
            user.avatarPath = AppConsts.remoteServiceBaseUrl + data.body.result;
            this.users.forEach(u => {
              if (u.managerId == user.id) {
                u.managerAvatarPath = user.avatarPath;
              }
            });
          } else { this.notify.error('Upload Avatar Failed!'); }
        });
      }
    });
  }

  nextOrPre(str): void {

    function getMaxChildWidth(elm) {
      let childrenWidth = $.map($('>*', elm), function (el: string) { return $(el).width(); });
      let max = 0;
      for (let i = 0; i < childrenWidth.length; i++) {
        max = childrenWidth[i] > max ? childrenWidth[i] : max;
      }
      return max;
    }

    function getScrollingValue(toLeft, ctx, pos, val) {

      if (toLeft) {
        return pos < 1 ? 0 : val;
      }
      return pos >= getMaxChildWidth(ctx) ? 0 : val;
    }

    if (str == 'left') {
      $('#tbl').scrollLeft(
        this.scrollbarPosition -= getScrollingValue(true, $('#tbl'), this.scrollbarPosition, this.scrollingValue)
      );
    } else {
      $('#tbl').scrollLeft(
        this.scrollbarPosition += getScrollingValue(false, $('#tbl'), this.scrollbarPosition, this.scrollingValue)
      );
    }
  }

  activateUser(id: number) {
    abp.message.confirm(this.l('Activate this user?'),
      (result: boolean) => {
        if (result) {
          this.userService.activateUser(id).subscribe(res => {
            if (res) {
              this.notify.success(this.l('Activated User Successfully!'));
              this.refresh();
            }
          });
        }
      }
    );
  }
}

export class userDTO {
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  phoneNumber: string;
  address: string;
  isActive: true;
  fullName: string;
  lastLoginTime: string;
  creationTime: string;
  roleNames: string[];
  projectUsers: ProjectUser[];
  type: number;
  salary: any;
  salaryAt: string;
  startDateAt: string;
  allowedLeaveDay: number;
  userCode: string;
  jobTitle: string;
  level: number;
  registerWorkDay: string;
  avatarPath: any;
  managerId: number;
  managerAvatarPath: string;
  managerName: string;
  branch: string;
  sex: number;
  expandProject = false;
  expandRole = false;
  expandUser = false;
  expandMgName = false;
  id: number;

  isLevelUp: boolean;
}
export class ProjectUser {
  projectId: number;
  projectCode: string;
  projectName: string;
  projectUserType: number;
}

export class UserManager {
  managerId: number;
  managerAvatarPath: string;
  managerName: string;
}

export class Manager {
  name: string;
  isActive: boolean;
  type: number;
  jobTitle: string;
  level: number;
  userCode: string;
  id: number;
}

export const ProjectUserType = [
  { value: 0, name: 'Member' },
  { value: 1, name: 'PM' },
  { value: 2, name: 'Shadow' },
  { value: 3, name: 'DeActive' }
];

export class UserForManager {
  name: string;
  isActive: boolean;
  type: number;
  jobTitle: string;
  level: number;
  userCode: string;
  id: number;
}

export class NameValue {
  name: string;
  value: boolean;
}