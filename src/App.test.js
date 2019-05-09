import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import App from './App';

Enzyme.configure({adapter: new EnzymeAdapter()});

/*
 * Factory function to create a shallowWrapper for the APp Component
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - initial state for setup
 * @returns {shallowWrapper}
*/

const setUp = (props={}, state=null) => {
  const wrapper = shallow(<App {...props} />)
  if(state) wrapper.setState(state);
  return wrapper;
}

/*
 * Return ShallowWrapper containing node(s) with the given data-test value.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper to search within.
 * @param {string} val - Value of data-test attribute for search.
 * @return  {ShallowWrapper
*/
const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
}


it('renders without error', () => {
  const wrapper = setUp();
  const appComponent = findByTestAttr(wrapper, 'component-app');
  expect(appComponent.length).toBe(1);
});

it('renders increment button', () => {
  const wrapper = setUp();
  const button = findByTestAttr(wrapper, 'increment-button');
  expect(button.length).toBe(1);
});

it('renders counter display', () => {
  const wrapper = setUp();
  const counterDisplay = findByTestAttr(wrapper, 'counter-display');
  expect(counterDisplay.length).toBe(1);
});

it('counter starts at 0', () => {
  const wrapper = setUp();
  const initialCounterState = wrapper.state('counter');
  expect(initialCounterState).toBe(0);
});


describe('Increment', () => {
  it('increments counter on display', () => {
    const counter = 7;
    const wrapper = setUp(null, {counter});

    //find button and click
    const button = findByTestAttr(wrapper, 'increment-button');
    button.simulate('click');
    wrapper.update();

    //find display and test value
    const counterDisplay = findByTestAttr(wrapper, 'counter-display');
    expect(counterDisplay.text()).toContain(counter + 1)

  });
});


describe('Decrement', () => {

  it('renders decrement button', () => {
    const wrapper = setUp();
    const button = findByTestAttr(wrapper, 'decrement-button');
    expect(button.length).toBe(1);
  });

  it('clicking decrement button decrements counter display when state is greater than 0', () => {
    const counter = 7;
    const wrapper = setUp(null, { counter });

    // find button and click
    const button = findByTestAttr(wrapper, 'decrement-button');
    button.simulate('click');
    wrapper.update();

    // find display and test value
    const counterDisplay = findByTestAttr(wrapper, 'counter-display');
    expect(counterDisplay.text()).toContain(counter - 1);
  });

  // make sure error doesn't show by default
  it('error does not show when not needed', () => {
    // I plan to implement this by using a "hidden" class for the error div
    // I plan to use the data-test value 'error-message' for the error div
    const wrapper = setUp();
    const errorDiv = findByTestAttr(wrapper, 'error-message');

    // using enzyme's ".hasClass()" method
    // http://airbnb.io/enzyme/docs/api/ShallowWrapper/hasClass.html
    const errorHasHiddenClass = errorDiv.hasClass('hidden');
    expect(errorHasHiddenClass).toBe(true);
  });


describe('counter is 0 and decrement is clicked', () => {
    // using a describe here so I can use a "beforeEach" for shared setup

    // scoping wrapper to the describe, so it can be used in beforeEach and the tests
    let wrapper
    beforeEach(() => {
      // no need to set counter value here; default value of 0 is good
      wrapper = setUp();

      // find button and click
      const button = findByTestAttr(wrapper, 'decrement-button');
      button.simulate('click');
      wrapper.update();
    });

    it('error shows', () => {
      // check the class of the error message
      const errorDiv = findByTestAttr(wrapper, 'error-message');
      const errorHasHiddenClass = errorDiv.hasClass('hidden');
      expect(errorHasHiddenClass).toBe(false);
    });

    it('counter still displays 0', () => {
      const counterDisplay = findByTestAttr(wrapper, 'counter-display');
      expect(counterDisplay.text()).toContain(0);
    });

    it('clicking increment clears the error', () => {
      // find and click the increment button
      const button = findByTestAttr(wrapper, 'increment-button');
      button.simulate('click');

      // check the class of the error message
      const errorDiv = findByTestAttr(wrapper, 'error-message');
      const errorHasHiddenClass = errorDiv.hasClass('hidden');
      expect(errorHasHiddenClass).toBe(true);
    });
  });
});