import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextListComponent } from "../text-list/text-list.component";
import { MatTabsModule } from '@angular/material/tabs';
import { CountryComponent } from "../country/country.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TextListComponent, MatTabsModule, CountryComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  selectedTab = 'table1';
  selectedTabIndex = 0;

  setTab(tab: string) {
    this.selectedTab = tab;
  }
}
