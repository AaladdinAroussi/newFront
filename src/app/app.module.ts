import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { LayoutComponent } from './component/layout/layout.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { Error404Component } from './component/error404/error404.component';
import { JobListComponent } from './component/job-list/job-list.component';
import { JobDetailsComponent } from './component/job-details/job-details.component';
import { CompanyListComponent } from './component/company-list/company-list.component';
import { CompanyDetailsComponent } from './component/company-details/company-details.component';
import { CandidateListComponent } from './component/candidate-list/candidate-list.component';
import { CandidateDetailsComponent } from './component/candidate-details/candidate-details.component';
import { BlogListComponent } from './component/blog-list/blog-list.component';
import { BlogDetailsComponent } from './component/blog-details/blog-details.component';
import { PricingComponent } from './component/pricing/pricing.component';
import { FaqComponent } from './component/faq/faq.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { CandidateDashboardComponent } from './component/candidate-dashboard/candidate-dashboard.component';
import { PostJobComponent } from './component/post-job/post-job.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterRecruiterComponent } from './component/register-recruiter/register-recruiter.component';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { AddCategoryComponent } from './component/add-category/add-category.component';
import { AddCityComponent } from './component/add-city/add-city.component';
import { AddCompanyComponent } from './component/add-company/add-company.component';
import { AddLevelComponent } from './component/add-level/add-level.component';
import { AddSectorComponent } from './component/add-sector/add-sector.component';
import { ListCityComponent } from './component/list-city/list-city.component';
import { ListCompanyComponent } from './component/list-company/list-company.component';
import { ListCategoryComponent } from './component/list-category/list-category.component';
import { ListLevelComponent } from './component/list-level/list-level.component';
import { ListSectorComponent } from './component/list-sector/list-sector.component';
import { SuperAdminDashboardComponent } from './component/super-admin-dashboard/super-admin-dashboard.component';
import { ProfilComponent } from './component/profil/profil.component';
import { PackagesComponent } from './component/packages/packages.component';
import { SuperAdminOffersComponent } from './component/super-admin-offers/super-admin-offers.component';
import { SideBarAdminComponent } from './component/side-bar-admin/side-bar-admin.component';
import { SideBarSuperAdminComponent } from './component/side-bar-super-admin/side-bar-super-admin.component';
import { SideBarCandidateComponent } from './component/side-bar-candidate/side-bar-candidate.component';
import { AdminJobsComponent } from './component/admin-jobs/admin-jobs.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { SuperAdminUsersComponent } from './component/super-admin-users/super-admin-users.component';
import { VerficationCodeComponent } from './component/verfication-code/verfication-code.component';
import { CandidateAddDetailsComponent } from './component/candidate-add-details/candidate-add-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    Error404Component,
    JobListComponent,
    JobDetailsComponent,
    CompanyListComponent,
    CompanyDetailsComponent,
    CandidateListComponent,
    CandidateDetailsComponent,
    BlogListComponent,
    BlogDetailsComponent,
    PricingComponent,
    FaqComponent,
    AboutUsComponent,
    CandidateDashboardComponent,
    PostJobComponent,
    RegisterRecruiterComponent,
    AdminDashboardComponent,
    AddCategoryComponent,
    AddCityComponent,
    AddCompanyComponent,
    AddLevelComponent,
    AddSectorComponent,
    ListCityComponent,
    ListCompanyComponent,
    ListCategoryComponent,
    ListLevelComponent,
    ListSectorComponent,
    SuperAdminDashboardComponent,
    ProfilComponent,
    PackagesComponent,
    SuperAdminOffersComponent,
    SideBarAdminComponent,
    SideBarSuperAdminComponent,
    SideBarCandidateComponent,
    AdminJobsComponent,
    ChangePasswordComponent,
    SuperAdminUsersComponent,
    VerficationCodeComponent,
    CandidateAddDetailsComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
