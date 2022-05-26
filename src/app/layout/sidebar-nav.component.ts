import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MenuItem } from '@shared/layout/menu-item';
import { MatDialog } from '@angular/material';
import { EditSidebarComponent } from './edit-sidebar/edit-sidebar.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    templateUrl: './sidebar-nav.component.html',
    selector: 'sidebar-nav',
    encapsulation: ViewEncapsulation.None
})
export class SideBarNavComponent extends AppComponentBase {

    menuItems: MenuItem[] = [
        new MenuItem(this.l('Admin'), '', 'group_work', '', [
            new MenuItem(this.l('Users'), 'Admin.Users', 'people', '/app/main/users'),
            new MenuItem(this.l('Clients'), 'Admin.Clients', 'people_outline', '/app/main/customers'),
        ]),
    ];
    ngOnInit(): void {
        this.menuItems = JSON.parse(localStorage.getItem("menuItems")) || this.menuItems;
    }
    editSidebar(menuItems) {
        const dialogRef = this._dialog.open(EditSidebarComponent, {
            data: menuItems,
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                localStorage.setItem("menuItems", JSON.stringify(res));
                this.menuItems = JSON.parse(localStorage.getItem("menuItems"));
                abp.message.success("Save Success");
            }
        })
    }

    resetSidebar() {
        localStorage.clear();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
        abp.message.success("Reset Success");
    }

    constructor(
        injector: Injector,
        private _dialog: MatDialog,
        private router: Router,
    ) {
        super(injector);
    }

    contextMenuPosition = { x: '0px', y: '0px' };
    onContextMenu(event: MouseEvent, temp) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        temp.openMenu();
    }
    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName);
        } else if (menuItem.items && menuItem.items.length > 0) {
            return menuItem.items.some(s => this.permission.isGranted(s.permissionName))
        }

        return true;
    }
}
