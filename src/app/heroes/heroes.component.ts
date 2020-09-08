import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../core';
import { HeroService } from './hero.service';
import KhaltiCheckout from 'khalti-checkout-web';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
})
export class HeroesComponent implements OnInit {
  selected: Hero;
  heroes$: Observable<Hero[]>;
  message = '?';
  heroToDelete: Hero;
  showModal = false;
  checkout: any;

  constructor(private heroService: HeroService) {
    this.heroes$ = heroService.entities$;
    let config = {
      // replace this key with yours
      publicKey: 'test_public_key_dc74e0fd57cb46cd93832aee0a390234',
      productIdentity: '1234567890',
      productName: 'Drogon',
      productUrl: 'http://gameofthrones.com/buy/Dragons',
      eventHandler: {
        onSuccess(payload) {
          // hit merchant api for initiating verfication
          console.log(payload);
        },
        // onError handler is optional
        onError(error) {
          // handle errors
          console.log(error);
        },
        onClose() {
          console.log('widget is closing');
        },
      },
      paymentPreference: [
        'KHALTI',
        'EBANKING',
        'MOBILE_BANKING',
        'CONNECT_IPS',
        'SCT',
      ],
    };

    let checkout = new KhaltiCheckout(config);
    this.checkout = checkout;
  }

  ngOnInit() {
    this.getHeroes();
  }

  handleKhaltiCheckout() {
    this.checkout.show({ amount: 1000 });
  }
  add(hero: Hero) {
    this.heroService.add(hero);
  }

  askToDelete(hero: Hero) {
    this.heroToDelete = hero;
    this.showModal = true;
    if (this.heroToDelete.name) {
      this.message = `Would you like to delete ${this.heroToDelete.name}?`;
    }
  }

  clear() {
    this.selected = null;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteHero() {
    this.closeModal();
    if (this.heroToDelete) {
      this.heroService
        .delete(this.heroToDelete.id)
        .subscribe(() => (this.heroToDelete = null));
    }
    this.clear();
  }

  enableAddMode() {
    this.selected = <any>{};
  }

  getHeroes() {
    this.heroService.getAll();
    this.clear();
  }

  save(hero: Hero) {
    if (this.selected && this.selected.name) {
      this.update(hero);
    } else {
      this.add(hero);
    }
  }

  select(hero: Hero) {
    this.selected = hero;
  }

  update(hero: Hero) {
    this.heroService.update(hero);
  }
}
