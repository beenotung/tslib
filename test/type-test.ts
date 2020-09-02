import { Drop } from '../src/type'

interface Animal {
  walk(): void

  name(): string
}

type Plant = Drop<Animal, 'walk'>

const cat: Animal = {
  walk() {
    // tslint:disable-next-line no-invalid-this
    console.log(this.name(), 'walking')
  },
  name() {
    return 'cat'
  },
}

let catFlower: Plant = cat

cat.walk()
// catFlower.walk() // want to test walk() should not exist

// instead, test if the plant is completed without walk()
catFlower = {
  name: catFlower.name,
}
