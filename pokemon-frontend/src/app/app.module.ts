import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { PokedexComponent } from './pokedex/pokedex/pokedex.component';
import { MainMenuComponent } from './main-menu/main-menu/main-menu.component';
import { CatchPokemonComponent } from './catch-pokemon/catch-pokemon/catch-pokemon.component';
import { PcPokemonComponent } from './pokedex/pokedex/pc-pokemon/pc-pokemon/pc-pokemon.component';

@NgModule({
  declarations: [
    AppComponent,
    PokedexComponent,
    MainMenuComponent,
    CatchPokemonComponent,
    PcPokemonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgOptimizedImage,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    
    RouterModule.forRoot([
      { path: '', redirectTo: 'main-menu', pathMatch: 'full' },
      {path: 'pokedex', component: PokedexComponent},
      {path: 'catch-pokemon', component: CatchPokemonComponent},
      {path: 'main-menu', component: MainMenuComponent},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
