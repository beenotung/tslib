import { Drop } from '../src/type'

interface Animal {
  walk(): void

  name(): string
}

type Plant = Drop<Animal, 'walk'>

const cat = {
  walk() {
    // tslint:disable-next-line no-invalid-this
    console.log(this.name(), 'walking')
  },
  name() {
    return 'cat'
  },
} as Animal

const catFlower = cat as Plant

cat.walk()
catFlower.walk()
