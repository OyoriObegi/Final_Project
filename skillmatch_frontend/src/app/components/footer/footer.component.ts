import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer mt-auto py-3 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>SkillMatch</h5>
            <p>Connecting talent with opportunity</p>
          </div>
          <div class="col-md-4">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: info&#64;skillmatch.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <hr>
        <div class="text-center">
          <p>&copy; 2024 SkillMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f8f9fa;
      padding: 2rem 0;
      margin-top: 3rem;
    }
    .footer h5 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    .footer a {
      color: #34495e;
      text-decoration: none;
    }
    .footer a:hover {
      color: #3498db;
    }
  `]
})
export class FooterComponent { } 