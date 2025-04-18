import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JobListComponent } from './job-list.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        JobListComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        NavbarComponent,
        FooterComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have jobs array', () => {
    expect(component.jobs).toBeDefined();
    expect(Array.isArray(component.jobs)).toBeTruthy();
  });
});
