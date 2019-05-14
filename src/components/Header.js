import React from 'react'
import PropTypes from 'prop-types'
import TodoTextInput from './TodoTextInput'
import styled from 'styled-components'

const StyledTitle = styled.h1`
  text-indent: 100%;
  overflow-x: hidden;
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg');
  height: 100px;
  background-size: auto 100px;
  background-position: center center;
  background-repeat: no-repeat;
  top: -180px !important;
`
const StyledInputWrapper = styled.div`
  input::placeholder {
    color: #00d8ff;
  }
`


const Header = ({addTodo}) => {

  const handleSave = text => {
    if (text.length !== 0) {
      addTodo(text)
    }
  }

  return (
    <header>
      <StyledTitle>React.todos</StyledTitle>
      <StyledInputWrapper>
        <TodoTextInput
          newTodo
          onSave={handleSave}
          placeholder="What needs to be done?"
        />
      </StyledInputWrapper>
    </header>
  )
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
}

export default Header
