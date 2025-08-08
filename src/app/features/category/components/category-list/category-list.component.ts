import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../../../models/category-response.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
   categories: CategoryResponse[] = [];
   isLoading = true;
    errorMessage = '';

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: data => {
        this.categories = data;
        this.isLoading = false;
      },
      error: error => {
        console.error('Failed to load categories', error);
        this.errorMessage = 'Failed to load categories';
        this.isLoading = false;
      }
    });
  }
}
