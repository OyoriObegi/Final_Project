import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.isLoggedIn = !!this.storageService.getUser();
  }

  logout() {
    this.storageService.removeUser();
    window.location.href = '/auth/login';
  }
}
