import { Drop } from '../src/type';

interface Animal {
  walk(): void

  name(): string
}

type Plant = Drop<Animal, 'walk'>;

let cat = {
  walk: function() {
    console.log(this.name(), 'walking');
  },
  name: function() {
    return 'cat';
  },
} as Animal;

let catFlower = cat as Plant;

cat.walk();
catFlower.walk();
