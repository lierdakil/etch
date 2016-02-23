/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.updateElementSync(component)', () => {
  it('performs an update of the component\'s element and any resulting child updates synchronously', () => {
    class ParentComponent {
      constructor () {
        this.greeting = 'Hello'
        this.greeted = 'World'
        etch.createElement(this)
      }

      render () {
        return (
          <div>
            <ChildComponent greeting={this.greeting}></ChildComponent> <span>{this.greeted}</span>
          </div>
        )
      }
    }

    class ChildComponent {
      constructor ({greeting}) {
        this.greeting = greeting
        etch.createElement(this)
      }

      render () {
        return <span>{this.greeting}</span>
      }

      update ({greeting}) {
        this.greeting = greeting
        etch.updateElement(this)
      }
    }

    let component = new ParentComponent()
    expect(component.element.textContent).to.equal('Hello World')
    component.greeting = 'Goodnight'
    component.greeted = 'Moon'
    etch.updateElementSync(component)
    expect(component.element.textContent).to.equal('Goodnight Moon')
  });

  it('performs only one update if an async update for the component is pending', () => {
    let componentA = {
      renderCount: 0,

      render () {
        this.renderCount++
        return <div></div>
      }
    }

    let componentB = {
      renderCount: 0,

      render () {
        this.renderCount++
        return <div></div>
      }
    }

    etch.createElement(componentA)
    etch.createElement(componentB)
    etch.updateElement(componentA)
    etch.updateElement(componentB)

    etch.updateElementSync(componentA)

    expect(componentA.renderCount).to.equal(2)
    expect(componentB.renderCount).to.equal(2)
  })
});
