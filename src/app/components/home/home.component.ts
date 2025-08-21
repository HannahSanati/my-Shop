import { Component, OnInit, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProductService } from '../../services/product.service';
import { Product, ProductDTO } from '../../models/product.model';
import { CommonModule } from '@angular/common';  
import { Router } from '@angular/router';


export const mockProducts: any[] = [
  {
    id: 76,
    title: "آیفون 13",
    description: "",
    price: 12000000,
    stock: 1,
    categoryId: 82,
    categoryName: "ios",
    attributeValues: [
      {
        id: 34,
        attributeId: 132,
        attributeName: "رنگ",
        attributeType: "STRING",
        value: "سفید",
        productId: null,
      },
    ],
  },
  {
    id: 77,
    title: "asus1",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 84,
    categoryName: "asus",
    attributeValues: [],
  },
  {
    id: 78,
    title: "ss",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 85,
    categoryName: "test",
    attributeValues: [],
  },
  {
    id: 79,
    title: "a",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 87,
    categoryName: "test select",
    attributeValues: [
      {
        id: 35,
        attributeId: 138,
        attributeName: "a",
        attributeType: "SELECT",
        value: "1",
        productId: null,
      },
    ],
  },
  {
    id: 80,
    title: "a",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 87,
    condition: 'new',
    categoryName: "test select",
    attributeValues: [
      {
        id: 36,
        attributeId: 138,
        attributeName: "a",
        attributeType: "SELECT",
        value: "1",
        productId: null,
      },
    ],
  },
  {
    id: 81,
    title: "iphon 13",
    description: "",
    price: 1223,
    stock: 0,
    categoryId: 82,
    condition: 'used',
    categoryName: "ios",
    attributeValues: [
      {
        id: 37,
        attributeId: 132,
        attributeName: "رنگ",
        attributeType: "STRING",
        value: "سفید",
        productId: null,
      },
    ],
  },
];

@Component({
  selector: 'app-home',
  imports: [CommonModule, InputTextModule, ButtonModule, CardModule],  
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],  
})
export class HomeComponent implements OnInit{
  private productService = inject(ProductService);
  // private router= Router


  // productDetails: Product[] = [];
  // allProducts: Product[] = [];
  // searchKeyword: string = '';
  // showLoadButton: boolean = true;
  // page: number = 1;

 
    // Products signal
    products = signal<Product[]>(mockProducts);

  // navigateTo(route: string) {
  //   this.router.navigate([route]);
  // }

  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts() {
    this.products.set(mockProducts)
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error(err)
    });
  }

  // Method to fetch products
  // loadProducts() {
  //   this.productService.getProducts().subscribe({
  //     next: (data: any) => {
  //       this.productDetails = data;
  //       this.allProducts = data;
  //     },
  //     error: (error: any) => {
  //       console.error('Error loading products', error);
  //     },
  //   });
  // }

  // Method to filter products based on the search keyword
  // searchByKeyword(keyword: string) {
  //   this.searchKeyword = keyword;

  //   if (this.searchKeyword.trim()) {
  //     this.productDetails = this.allProducts.filter((product) =>
  //       product.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
  //     );
  //   } else {
  //     this.productDetails = [...this.allProducts];
  //   }
  // }

  // Handle showing the product details
  // showProductDetails(productId: number) {
  //   console.log('Product ID:', productId);
  // }

  // Load more products when button is clicked
//   loadMoreProduct() {
//     console.log('Load more products...');
//     this.page += 1;
//     this.productService.getProducts().subscribe({
//       next: (data: any) => {
//         this.productDetails = [...this.productDetails, ...data];
//       },
//       error: (error: any) => {
//         console.error('Error loading more products', error);
//       },
//     });
//   }
}



















































// import { Component, OnInit } from '@angular/core';
// import { ButtonModule } from 'primeng/button';
// import { CardModule } from 'primeng/card';
// import { InputTextModule } from 'primeng/inputtext';
// import { ProductService } from '../../services/product.service';
// import { Product } from '../../models/product.model';
// import { CommonModule } from '@angular/common';  
// import { Router } from '@angular/router';



// @Component({
//   selector: 'app-home',
//   imports: [CommonModule, InputTextModule, ButtonModule, CardModule],  
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],  
// })
// export class HomeComponent implements OnInit{
//   productDetails: Product[] = [];
//   allProducts: Product[] = [];
//   searchKeyword: string = '';
//   showLoadButton: boolean = true;
//   page: number = 1;

//   constructor(private productService: ProductService,
//     private router: Router
//   ) {}
//   navigateTo(route: string) {
//     this.router.navigate([route]);
//   }

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   // Method to fetch products
//   loadProducts() {
//     this.productService.getProducts().subscribe({
//       next: (data: any) => {
//         this.productDetails = data;
//         this.allProducts = data;
//       },
//       error: (error: any) => {
//         console.error('Error loading products', error);
//       },
//     });
//   }

//   // Method to filter products based on the search keyword
//   searchByKeyword(keyword: string) {
//     this.searchKeyword = keyword;

//     if (this.searchKeyword.trim()) {
//       this.productDetails = this.allProducts.filter((product) =>
//         product.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
//       );
//     } else {
//       this.productDetails = [...this.allProducts];
//     }
//   }

//   // Handle showing the product details
//   showProductDetails(productId: number) {
//     console.log('Product ID:', productId);
//   }

//   // Load more products when button is clicked
//   loadMoreProduct() {
//     console.log('Load more products...');
//     this.page += 1;
//     this.productService.getProducts().subscribe({
//       next: (data: any) => {
//         this.productDetails = [...this.productDetails, ...data];
//       },
//       error: (error: any) => {
//         console.error('Error loading more products', error);
//       },
//     });
//   }
// }
