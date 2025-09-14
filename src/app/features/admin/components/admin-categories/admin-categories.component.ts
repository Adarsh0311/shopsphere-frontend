import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CategoryResponse } from '../../../../models/category-response.model';
import { CategoryCreateRequest } from '../../../../models/admin.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-categories">
      <div class="page-header">
        <h1>Category Management</h1>
        <button class="add-btn" (click)="openAddCategoryModal()">
          <i class="fas fa-plus"></i>
          Add Category
        </button>
      </div>

      <div class="categories-list" *ngIf="!isLoading">
        <div *ngFor="let category of categories" class="category-card">
          <div class="category-info">
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
          </div>
          <div class="category-actions">
            <button class="edit-btn" (click)="editCategory(category)">Edit</button>
            <button class="delete-btn" (click)="deleteCategory(category.categoryId)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showCategoryModal" class="modal-overlay" (click)="closeCategoryModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <form (ngSubmit)="saveCategory()" class="category-form">
            <h2>{{ isEditMode ? 'Edit Category' : 'Add New Category' }}</h2>
            
            <div class="form-group">
              <label>Category Name</label>
              <input type="text" [(ngModel)]="categoryForm.name" name="name" required class="form-control">
            </div>
            
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="categoryForm.description" name="description" class="form-control"></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" (click)="closeCategoryModal()" class="cancel-btn">Cancel</button>
              <button type="submit" class="save-btn">{{ isEditMode ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  categories: CategoryResponse[] = [];
  isLoading = true;
  showCategoryModal = false;
  isEditMode = false;
  
  categoryForm: CategoryCreateRequest = {
    name: '',
    description: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.adminService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  openAddCategoryModal(): void {
    this.isEditMode = false;
    this.categoryForm = { name: '', description: '' };
    this.showCategoryModal = true;
  }

  editCategory(category: CategoryResponse): void {
    this.isEditMode = true;
    this.categoryForm = {
      name: category.name,
      description: category.description || ''
    };
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
  }

  saveCategory(): void {
    this.adminService.createCategory(this.categoryForm).subscribe({
      next: (newCategory) => {
        this.categories.push(newCategory);
        this.closeCategoryModal();
      },
      error: (error) => {
        console.error('Error creating category:', error);
      }
    });
  }

  deleteCategory(categoryId: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.adminService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.categoryId !== categoryId);
        },
        error: (error) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  }
}
