import { Component } from '@angular/core';
import { ProductReviewsItem } from '../../type/types';
import { formatDate } from '../../shared/dates';
import { FormsModule } from '@angular/forms';
import { MAccordion } from '../marcha/m-accordion/m-accordion';
import { MAvatar } from '../marcha/m-avatar/m-avatar';
import { MButton } from '../marcha/m-button/m-button';
import { MDialog } from '../marcha/m-dialog/m-dialog';
import { MIcon } from '../marcha/m-icon/m-icon';
import { MTextarea } from '../marcha/m-textarea/m-textarea';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [FormsModule, MAvatar, MButton, MDialog, MIcon, MTextarea],
  templateUrl: './product-reviews.html',
})
export class ProductReviews {
  visible: boolean = false;
  text: string = '';
  rating: number = 5;
  reviews: ProductReviewsItem[] = [
    {
      user: 'Laura Sánchez',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      date: formatDate('2025-08-10'),
      review:
        '¡Muy buen servicio! La atención fue rápida y el producto llegó en perfectas condiciones. Recomiendo totalmente.',
      rating: 4,
    },
    {
      user: 'Carlos Ramírez',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
      date: formatDate('2025-08-09'),
      review:
        'Tuve un problema con el envío, pero el soporte lo resolvió enseguida. Volveré a comprar sin duda.',
      rating: 5,
    },
    {
      user: 'María Gómez',
      avatar:
        'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
      date: formatDate('2025-08-07'),
      review:
        'El producto superó mis expectativas. Calidad excelente y entrega puntual. ¡Gracias!',
      rating: 5,
    },
  ];

  showDialog(value: boolean) {
    this.visible = value;
  }

  setRating(star: number) {
    this.rating = star;
  }
}
