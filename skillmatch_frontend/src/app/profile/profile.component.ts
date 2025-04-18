import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userRole: string = '';
  skills: string[] = [];
  newSkill: string = '';
  isSubmitting = false;
  isBrowser: boolean;
  
  // Validation patterns
  phonePattern = '^[0-9]{10}$';
  urlPattern = '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializeForm();
      const userData = this.storageService.getUser();
      if (userData) {
        this.userRole = userData.role;
        this.updateValidatorsBasedOnRole();
        this.patchFormValues(userData);
      } else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  private initializeForm() {
    if (!this.profileForm) {
      this.profileForm = this.fb.group({
        // Common fields
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
        location: ['', Validators.required],
        bio: ['', [Validators.required, Validators.maxLength(500)]],
        
        // Job seeker fields
        firstName: [''],
        lastName: [''],
        experience: [''],
        education: [''],
        
        // Employer fields
        companyName: [''],
        companyWebsite: ['', Validators.pattern(this.urlPattern)],
        companySize: [''],
        industry: ['']
      });
    }
  }

  private updateValidatorsBasedOnRole() {
    if (this.isJobSeeker()) {
      this.profileForm.get('firstName')?.setValidators([Validators.required]);
      this.profileForm.get('lastName')?.setValidators([Validators.required]);
      this.profileForm.get('experience')?.setValidators([Validators.required]);
      this.profileForm.get('education')?.setValidators([Validators.required]);
    } else if (this.isEmployer()) {
      this.profileForm.get('companyName')?.setValidators([Validators.required]);
      this.profileForm.get('companySize')?.setValidators([Validators.required]);
      this.profileForm.get('industry')?.setValidators([Validators.required]);
    }
    this.profileForm.updateValueAndValidity();
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('pattern')) {
      switch (controlName) {
        case 'phone':
          return 'Please enter a valid 10-digit phone number';
        case 'companyWebsite':
          return 'Please enter a valid URL (e.g., https://example.com)';
        default:
          return 'Invalid format';
      }
    }
    if (control.hasError('maxlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} cannot exceed ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }

  addSkill() {
    if (this.newSkill && !this.skills.includes(this.newSkill)) {
      this.skills.push(this.newSkill);
      this.newSkill = '';
    }
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const userData = {
        ...formData,
        role: this.userRole,
        skills: this.skills
      };
      
      // Update user data in storage
      this.storageService.setUser(userData);
      
      // Show success message
      alert('Profile updated successfully!');
    }
  }

  isJobSeeker(): boolean {
    return this.userRole === 'jobseeker';
  }

  isEmployer(): boolean {
    return this.userRole === 'employer';
  }

  private patchFormValues(userData: any) {
    this.profileForm.patchValue({
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      bio: userData.bio,
      ...(userData.role === 'jobseeker' ? {
        firstName: userData.firstName,
        lastName: userData.lastName,
        experience: userData.experience,
        education: userData.education
      } : {
        companyName: userData.companyName,
        companyWebsite: userData.companyWebsite,
        companySize: userData.companySize,
        industry: userData.industry
      })
    });
  }
} 