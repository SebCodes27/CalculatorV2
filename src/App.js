import './index.css';
import './App.css';
import React from 'react';
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      operator: '',
      newInt: '',
      prevTotal: '',
      firstOp: 'no',
      totaled: 'no'
    }
    this.handleNumChange = this.handleNumChange.bind(this);
    this.handleDecChange = this.handleDecChange.bind(this);
    this.handleOpChange = this.handleOpChange.bind(this);
    this.clearPreview = this.clearPreview.bind(this);
    this.showTotal = this.showTotal.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentDidMount() { // sets the event listener for key inputs
    document.addEventListener("keydown", this.handleKeyPress); 
  }
  handleKeyPress(event) { // handles key inputs, including 'enter', 'escape', and operations and numbers which are identified by id
    let numObj = {
      0: 'zero',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
      9: 'nine',
      '+': 'add',
      '-': 'subtract',
      'x': 'multiply',
      '/': 'divide',
      '.': 'decimal'
    }
    let key = numObj[event.key];
    let clicked = document.getElementById(key);
    if (event.key === 'Enter') {
      let clicked = document.getElementById('equals');
      clicked.click();
    }
    if (event.key === 'Escape') {
      let clicked = document.getElementById('clear');
      clicked.click();
    }
    if (clicked === null) { // prevents any reaction from keys not included or paired to an id
      return;
    };
    
    clicked.click();
    
  }
  handleNumChange(num) { // handles number inputs
    if (this.state.totaled === 'yes') { // prevents new values being concatenated to a total
      return;
    }
    if (num === '0') {
      let truthVal = 1;
      let length = this.state.text.length;
      for (let i = length; i > 0; i--) {
        let textLen = this.state.text[i - 1]
        if (textLen === '0') {
          truthVal *= 0;
        } else if (/[1-9]|./g.test(textLen) === true) {
          truthVal += 1;
          i = 0;
        }
        else if (textLen === '+' || textLen === '-' || textLen === 'x' || textLen === '/' ) {
          i = 0
        }
      }
      console.log(truthVal);
      if (truthVal === 0) {
        return;
      }
    }
    let newText = this.state.text + num; // prepares the window preview
    let newVal = '';
    let lastVal = this.state.text[this.state.text.length - 1];
    let strPrevTotal = this.state.prevTotal.toString() + num;
    if (this.state.firstOp === 'no') { // handles the inclusion of decimals in the first input value, i.e '1.05 x 3'
      if (num === '0') {
        this.setState({
          prevTotal: strPrevTotal
        })
      } else {
        this.setState({
          prevTotal: parseFloat(strPrevTotal)
        })
    }
  }
    if (lastVal !== '+' && lastVal !== 'x' && lastVal !== '÷') { // concatenates, rather than operates, new values, '3' + '3' = 33
      newVal += (this.state.newInt).toString() + num;
    } else {
      newVal += num;
    }
    let parseNewVal = parseFloat(newVal);
    if (num === '0') { // handles the inclusion of decimals in the second input value
      parseNewVal = newVal
    }
    this.setState({ // sets the window preview and the second value for operating
      newInt: parseNewVal,
      text: newText
    })
  }
  handleDecChange(dec) { // handles the decimal input
    if (this.state.totaled === 'yes') { // prevents decimal point being concatenated to a total
      return;
    }
    let newText = this.state.text + dec; // prepares the window preview
    let newVal = '';
    let lastVal = this.state.text[this.state.text.length - 1];
    let strPrevTotal = this.state.prevTotal.toString() + dec;
    if (this.state.firstOp === 'no') { // handles the inclusion of decimals in the first input value, i.e '1.05 x 3'
      this.setState({
        prevTotal: strPrevTotal
      })
    }
    if (lastVal !== '+' && lastVal !== '-' && lastVal !== 'x' && lastVal !== '÷' && lastVal !== '.') { // makes certain decimal point is never repeated
      newVal += (this.state.newInt).toString() + dec;
    } else if (lastVal === '.') {
      return
    } else {
      newVal += '0' + dec;
    }
    this.setState({ // sets window preview and second value for operating
      text: newText,
      newInt: newVal,
    });
  }
  handleOpChange(sym, operator) { // handles operations
    let lastVal = this.state.text[this.state.text.length - 1];
    let newText = this.state.text + sym; // sets up the preview
    let currOp = this.state.operator;
    let operatorVal = operator;
    let newVal = '';
    if (lastVal === '+' || lastVal === "-" || lastVal === 'x' || lastVal === '÷') { // prevents double use of operations
      currOp = '';
      if (operator === 'minus') {
        operatorVal = this.state.operator;
        newVal = '-' + (this.state.newInt).toString();
      }
    }
    if (this.state.totaled === 'yes') {
      currOp = ''
    }
    this.setState({ // sets window preview, operator value, true or false of first operation, and true or false of a previous total existing
      text: newText,
      operator: operatorVal,
      firstOp: 'yes',
      totaled: 'no',
      newInt: newVal, /* the final melon */
    });
    let prevTotal = '';
    let length = '';
    if (this.state.prevTotal.toString().length > this.state.newInt.toString().length) { // sets the correct number of decimal places
      let ind = this.state.prevTotal
      .toString()
      .indexOf('.');
      length = this.state.prevTotal.toString().length - ind - 1
    } else {
      let ind = this.state.newInt
      .toString()
      .indexOf('.');
      length = this.state.newInt.toString().length - ind - 1
    };
    if (currOp === 'plus') { // adding operation
        prevTotal = parseFloat(this.state.prevTotal) + parseFloat(this.state.newInt);
      };
    if (currOp === 'minus') { // subtracting operation
        prevTotal = parseFloat(this.state.prevTotal) - parseFloat(this.state.newInt);
    }
    if (currOp === 'multiply') { // multiplying operation
        prevTotal = parseFloat(this.state.prevTotal) * parseFloat(this.state.newInt);
    }
    if (currOp === 'divide') { // dividing operation
        prevTotal = parseFloat(this.state.prevTotal) / parseFloat(this.state.newInt);
    }
    if (/\./.test(prevTotal) === true) {
      prevTotal = prevTotal.toFixed(length);
    }
    if (currOp !== '') { // sets outcome, for display or next operation
      this.setState({
        prevTotal: prevTotal
      })
    }
  }

  clearPreview() { // resets all values
    this.setState({
      text: '0',
      prev: '',
      operator: '',
      newInt: '',
      prevTotal: '',
      firstOp: 'no',
      totaled: 'no'
    });
  }

  showTotal() { // handles operations and displays the outcome
    let currOp = this.state.operator;
    let prevTotal = '';
    let text = '';
    let length = '';
    if (this.state.prevTotal.toString().length > this.state.newInt.toString().length) { // sets the correct number of decimal places
      let ind = this.state.prevTotal
      .toString()
      .indexOf('.');
      length = this.state.prevTotal.toString().length - ind - 1
    } else {
      let ind = this.state.newInt
      .toString()
      .indexOf('.');
      length = this.state.newInt.toString().length - ind - 1
    };
    if (currOp === 'plus') {
      prevTotal = parseFloat(this.state.prevTotal) + parseFloat(this.state.newInt);
      text = parseFloat(this.state.prevTotal) + parseFloat(this.state.newInt);
    }
    if (currOp === 'minus') {
      prevTotal = parseFloat(this.state.prevTotal) - parseFloat(this.state.newInt);
      text = parseFloat(this.state.prevTotal) - parseFloat(this.state.newInt);
    }
    if (currOp === 'multiply') {
      prevTotal = parseFloat(this.state.prevTotal) * parseFloat(this.state.newInt);
      text = parseFloat(this.state.prevTotal) * parseFloat(this.state.newInt);
    }
    if (currOp === 'divide') {
      prevTotal = parseFloat(this.state.prevTotal) / parseFloat(this.state.newInt);
      text = parseFloat(this.state.prevTotal) / parseFloat(this.state.newInt);
    }
    if (/\./.test(prevTotal) === true) {
      let truthVal = 0;
      let length = text.toString().length;
      for (let i = length; i > 0; i--) {
        let textLen = text.toString()[i - 1];
        if (textLen === '0') {
          truthVal *= 1 + 1;
        } else if (/[1-9]/g.test(textLen) === true) {
          truthVal += 1;
        }
        else if (textLen === '.') {
          i = 0
        }
      }
      if (truthVal > 4) {
        truthVal = 4;
      }
      text = text.toFixed(truthVal);
    }
    this.setState({
      prevTotal: prevTotal,
      text: text,
      totaled: 'yes'
    })
  }

  render () {
  return (
    <div id='calculator' className='container-fluid outerBox'>

      <h1 id='title' className='text-lg'>Quick Calculator Maths</h1>

      <div id="container" className='innerBox well center'>

        <TextDisplay text={this.state.text}/>
        <ButtonInput text={this.state.text} handleNumChange={this.handleNumChange} handleDecChange={this.handleDecChange} handleOpChange={this.handleOpChange} clearPreview={this.clearPreview} showTotal={this.showTotal}/>
      
      </div>

    </div>
  )
}};

class TextDisplay extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
          <div className='textBox'>

            <textarea id='display' value={this.props.text} className='form-control' />

          </div>
    )}};

class ButtonInput extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (

      <div className='container-fluid well buttonBox'>

        <div className='col-xs-8'>

          <div className='btn-group'>

            <button id='seven' onClick={() => this.props.handleNumChange('7')} className='btn btn-default btn-width 7'>7</button>
            <button id='eight' onClick={() => this.props.handleNumChange('8')} className='btn btn-default btn-width 8'>8</button>
            <button id='nine' onClick={() => this.props.handleNumChange('9')} className='btn btn-default btn-width 9'>9</button>
          
          </div>

          <div className='btn-group'>

            <button id='four' onClick={() => this.props.handleNumChange('4')} className='btn btn-default btn-width 4'>4</button>
            <button id='five' onClick={() => this.props.handleNumChange('5')} className='btn btn-default btn-width 5'>5</button>
            <button id='six' onClick={() => this.props.handleNumChange('6')} className='btn btn-default btn-width 6'>6</button>
          
          </div>

          <div className='btn-group'>

            <button id='one' onClick={() => this.props.handleNumChange('1')} className='btn btn-default btn-width 1'>1</button>
            <button id='two' onClick={() => this.props.handleNumChange('2')} className='btn btn-default btn-width 2'>2</button>
            <button id='three' onClick={() => this.props.handleNumChange('3')} className='btn btn-default btn-width 3'>3</button>
          
          </div>

          <div className='btn-group'>

            <button id='clear' onClick={this.props.clearPreview} className='btn btn-default btn-width'>Clear (Esc) </button>
            <button id='zero' onClick={() => this.props.handleNumChange('0')} className='btn btn-default btn-width 0'>0</button>
            <button id='decimal' onClick={() => this.props.handleDecChange('.')} className='btn btn-default btn-width .'>.</button>
          
          </div>

        </div>

        <div className='col-xs-2'>

          <div className='btn-group btn-group-vertical'>

            <button id='divide' onClick={() => this.props.handleOpChange('÷', 'divide')} className='btn btn-default'>÷</button>
            <button id='multiply' onClick={() => this.props.handleOpChange('x', 'multiply')} className='btn btn-default'>×</button>
            <button id='subtract' onClick={() => this.props.handleOpChange('-', 'minus')} className='btn btn-default'>–</button>
            <button id='add' onClick={() => this.props.handleOpChange('+', 'plus')} className='btn btn-default'>+</button>
        
          </div>

        </div>

        <div className='col-xs-2'>

          <button id='equals' onClick={this.props.showTotal} className='btn btn-default btn-block btn-height-tall'>= (Enter)</button>
        
        </div>

      </div>

    )
    }};
        

function App() {
  return (
    <div>
      <Calculator />
    </div>
  );
}

export default App;