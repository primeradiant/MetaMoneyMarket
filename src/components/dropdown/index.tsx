import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

export enum DropdownPositions {
  Center,
  Left,
  Right,
}

interface DropdownWrapperBodyProps {
  horizontalPosition?: DropdownPositions;
}

interface Props extends HTMLAttributes<HTMLDivElement>, DropdownWrapperBodyProps {
  body: React.ReactNode;
  header: React.ReactNode;
  shouldCloseDropdownOnClickOutside?: boolean;
}

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownWrapperHeader = styled.div`
  cursor: pointer;
  position: relative;
`;

const DropdownWrapperBody = styled.div<DropdownWrapperBodyProps>`
    position: absolute;
    top: calc(100% + 15px);

    ${props => (props.horizontalPosition === DropdownPositions.Left ? 'left: 0;' : '')}

    ${props => (props.horizontalPosition === DropdownPositions.Center ? 'left: 50%; transform: translateX(-50%);' : '')}

    ${props => (props.horizontalPosition === DropdownPositions.Right ? 'right: 0;' : '')}
`;

interface State {
  isOpen: boolean;
}

export class Dropdown extends React.Component<Props, State> {
  public readonly state: State = {
    isOpen: false,
  };
  private wrapperRef: any;

  public render = () => {
    const {header, body, horizontalPosition = DropdownPositions.Left, ...restProps} = this.props;

    return (
      <DropdownWrapper ref={this.setWrapperRef} {...restProps}>
        <DropdownWrapperHeader onClick={this.toggleDropdown}>{header}</DropdownWrapperHeader>
        {this.state.isOpen ? (
          <DropdownWrapperBody horizontalPosition={horizontalPosition} onClick={this.closeDropdownBody}>
            {body}
          </DropdownWrapperBody>
        ) : null}
      </DropdownWrapper>
    );
  };

  public componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  public componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  public closeDropdown = () => {
    this.setState({isOpen: false});
  };

  private readonly setWrapperRef = (node: any) => {
    this.wrapperRef = node;
  };

  private readonly handleClickOutside = (event: any) => {
    const {shouldCloseDropdownOnClickOutside = true} = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (shouldCloseDropdownOnClickOutside) {
        this.closeDropdown();
      }
    }
  };

  private readonly toggleDropdown = () => {
    this.setState({isOpen: !this.state.isOpen});
  };

  private readonly closeDropdownBody = () => {
    const {shouldCloseDropdownOnClickOutside = true} = this.props;
    if (shouldCloseDropdownOnClickOutside) {
      this.closeDropdown();
    }
  };
}
