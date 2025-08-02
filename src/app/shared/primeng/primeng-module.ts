import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { InputNumber } from 'primeng/inputnumber';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Menubar,
    Menubar,
    ImageModule,
    TieredMenuModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    InputNumber,
    DataViewModule,
    TagModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    InputMaskModule,
    CheckboxModule,
    TextareaModule,
    AnimateOnScrollModule,
    AvatarModule,
    DividerModule,
  ],
  exports: [
    Menubar,
    ImageModule,
    TieredMenuModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    InputNumber,
    DataViewModule,
    TagModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    InputMaskModule,
    CheckboxModule,
    TextareaModule,
    AnimateOnScrollModule,
    AvatarModule,
    DividerModule,
  ],
})
export class PrimengModule {}
