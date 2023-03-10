import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const routerSlideAnimation = trigger('routeAnimations', [
    transition('main-menu => pokedex, catch-pokemon => main-menu', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('700ms ease-out', style({ left: '-100%' }))
        ]),
        query(':enter', [
          animate('700ms ease-out', style({ left: '0%' }))
        ]),
      ]),
    ]),
    transition('pokedex => main-menu, main-menu => catch-pokemon', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('700ms ease-out', style({ left: '100%' }))
        ]),
        query(':enter', [
          animate('700ms ease-out', style({ left: '0%' }))
        ]),
      ]),
    ])
]);