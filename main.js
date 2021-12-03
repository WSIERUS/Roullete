class DrawApp extends React.Component {

  state = {
    money: 100,
    choicePanel: [],
    otherBetType: [
      {type: "red", name: 'Red', id: 0,  multiplier: 2},
      {type: "black", name: 'Black', id: 1, multiplier: 2},
      {type: "1-12",name: '1-12',id: 2,multiplier: 3},
      {type: "13-24",name: '13-24',id: 3,multiplier: 3},
      {type: "25-36",name: '25-36',id: 4,multiplier: 3},
      {type: "even",name: 'Even',id: 5,multiplier: 2},
      {type: "odd",name: 'Odd',id: 6,multiplier: 2},
    ],
    betMoney: 0,
    betType: '',
    betMultiplier: '',
    bets: [],
    betIndex: 0,
    drawNumber: '0',
    drawColor: 'green'
  }

  componentDidMount() { // Generowanie Panelu rueltki
    let drawElements = []
    let color = 'green'
    let size = 'element-big'
    for (let i = 0; i <= 36; i++) {
      drawElements.push({
        id: i,
        type: i,
        color: color,
        size: size,
        multiplier: 35
      })
      if ((i % 2 && i > 18) || (i % 2 - 1 && i < 18)) {
        color = 'red', size = 'element-small'
      } else {
        color = 'black', size = 'element-small'
      }
    }
    this.setState({
      choicePanel: drawElements
    })
  }

  handleChangeBets = (event) => { // Tworzenie zakładu
    this.setState({
      betMoney: event.target.value
    })
  }

  handleClickBetsNumber = (id) => { // Obsługa wyboru po numerze
    this.setState({
      betType: id.toString(),
      betMultiplier: 35
    })
  }

  handleClickBetsType = (id) => { // Obsługa wyboru po typie
    this.setState({
      betType: id.type,
      betMultiplier: id.multiplier
    })
  }

  addBet = (id) => { // Dodaj zakład

    if (this.state.betMoney > 0 && this.state.betMoney <= this.state.money && this.state.bets.length < 8) {
      this.state.bets.push({
        type: id.type.toString(),
        money: parseInt(this.state.betMoney),
        multiplier: id.multiplier,
        id: this.state.betIndex
      })
      this.setState({
        money: this.state.money - this.state.betMoney,
        bets: this.state.bets,
        betIndex: this.state.betIndex+=1
      })
    }
  }

  delBet = (id) => { // Usuwanie zakładu
    let bets = this.state.bets
    let index = bets.findIndex(bet => id === bet.id)
    let returnMoney = bets[index].money
    bets.splice(index,1)
    this.setState({
      bets: bets,
      money: this.state.money += returnMoney
    })
  }

  draw = () => { // Losowanie

    let drawResult = Math.floor(Math.random() * this.state.choicePanel.length).toString()
    let colorResult = this.state.choicePanel[drawResult].color

    this.state.bets.forEach(element => {

      if (element.type.length <= 2) {
        if (element.type === drawResult) {
          this.win(element)
        } else {
          null
        }
      } else if (element.type.length > 2) {
        if (element.type === colorResult) {
          this.win(element)
        } else if (element.type) {
          if (element.type === '1-12' && drawResult < 13) {
            this.win(element)
          } else if (element.type === '13-24' && drawResult < 25 && drawResult > 12) {
            this.win(element)
          } else if (element.type === '25-36' && drawResult > 24) {
            this.win(element)
          } else {
            null
          }
        } else {
          null
        }
      }

    })
    this.setState({
      drawNumber: drawResult,
      drawColor: colorResult,
      bets: []
    })
  }

  win = (element) => { // Wygrana
    this.setState({
      money: this.state.money += element.money * element.multiplier
    })
  }

  render() {
    return ( 
      <React.Fragment>
      <div className = 'flex-app' >
      <Rolling render = {this.state}/> 
      <section>
      <ChoicePanel choicePanel = {this.state.choicePanel} click = {this.addBet}/> 
      <Buttons buttonType = {this.state.otherBetType} click = {this.addBet}/> 
      </section> 
      <section className = 'hud' >
      <Hud data = {this.state} inputBets = {this.handleChangeBets} draw = {this.draw}/> 
      </section> 
      <span className = 'bets-title' > Zakłady </span> 
      <Bets bets = {this.state.bets} click={this.delBet}/> 
      </div> 
      </React.Fragment>
    )
  }
}

class Rolling extends React.Component { // Renderowanie wylosowanej liczby
  render() {
    return ( 
      <span style = {{color: this.props.render.drawColor}} className = 'render-number' > 
        {this.props.render.drawNumber} 
      </span>
    )
  }
}

class ChoicePanel extends React.Component { // Panel wyboru numeru
  render() {
    return ( 
      <section className = 'choice-panel' > {
        this.props.choicePanel.map(element => < Element element = {element}
        click = {this.props.click}/>)} 
      </section>
            )
          }
        }

class Buttons extends React.Component { // Przyciski wyboru typu
  render() {
    return ( 
      <section> 
        {this.props.buttonType.map(element => < Button element = {element}
        click = {this.props.click}/>)} 
      </section>
    )
  }
}

const Element = (props) => { // Przycisk wyboru numeru
  return ( 
    <span className = {props.element.size} style = {{backgroundColor: props.element.color}}
    onClick = {() => props.click(props.element)}> 
      {props.element.type} 
    </span>
  )
}

const Button = (props) => { // Przycisk wyboru typu
  return ( 
    <button className = 'choice-button' id = {props.element.id} onClick = {() => props.click(props.element)}> 
      {props.element.name} 
    </button>
  )
}

class Hud extends React.Component { // Hud
  render() {
    return ( 
      <React.Fragment >
        <section className = 'hud-span' >
          Money:
          <span style = {{color: 'rgb(206, 177, 51)'}}> 
            {' ' + this.props.data.money}$ 
          </span> 
        </section > 
        <section className = 'hud-span' >
          <input type = "number" onChange = {this.props.inputBets} className='hud-input' placeholder='Bet value'/> 
        </section> 
        <button onClick = {this.props.draw} className = 'draw-button' > 
          Losuj 
        </button> 
      </React.Fragment>
    )
  }
}

const Bets = (props) => { // Zakłady
  if (props.bets.length > 0) {
    return ( 
      <section className = 'bets' > 
        {props.bets.map(bet => < Bet bet = {bet} click={props.click}/>).sort((a,b)=> a.props.bet.money > b.props.bet.money ? -1 : 1)}
      </section >
    )
  }
  else return null
}

const Bet = (props) => { // Zakład
  return ( 
    <section className = 'bet' >
      <span className = 'bet-span' > 
        Typ: {props.bet.type} 
      </span> 
      <span className = 'bet-span' > 
        Wartość: {props.bet.money} 
      </span> 
      <span className = 'bet-span' >
        Mnożnik: {props.bet.multiplier}
      </span>
      <button className = 'bet-button' onClick={() => props.click(props.bet.id)}>X</button> 
    </section>
  )
}

ReactDOM.render(<DrawApp /> , document.querySelector('#root'))