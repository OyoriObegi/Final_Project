import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent
  ],
  exports: [
    MatIconModule,
    NavbarComponent,
    FooterComponent
  ]
})
export class SharedModule { }
