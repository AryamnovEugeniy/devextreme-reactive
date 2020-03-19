import * as React from 'react';
import { shallow } from 'enzyme';
import { StyledContainer } from './styled-container';

describe('Appointments', () => {
  const defaultProps = {
    style: {},
  };
  describe('StyledContainer', () => {
    it('should pass rest props to the root element', () => {
      const tree = shallow((
        <StyledContainer {...defaultProps} className="custom-class">
          <div />
        </StyledContainer>
      ));

      expect(tree.find('.custom-class'))
        .toBeTruthy();
    });
    it('should render children inside', () => {
      const tree = shallow((
        <StyledContainer {...defaultProps} data={{ a: 1 }}>
          <div className="child" />
        </StyledContainer>
      ));

      expect(tree.find('.child').exists())
        .toBeTruthy();
    });
  });
});
