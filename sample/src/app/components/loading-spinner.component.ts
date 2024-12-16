/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loader-container">
      <div class="loader"></div>
    </div>
  `,
  styles: [
    `
      .loader-container {
        overflow: hidden;
      }

      .loader {
        height: 4px;
        background: #007bff;
        border-radius: 5px;
        animation: slide 1s cubic-bezier(0.4, 0, 1, 1) infinite;
      }

      @keyframes slide {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `,
  ],
  standalone: false,
})
export class LoadingSpinnerComponent {}
