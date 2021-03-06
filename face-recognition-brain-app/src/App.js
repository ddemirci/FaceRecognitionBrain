import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecoginiton from './components/FaceRecoginiton/FaceRecognition';
import Clarifai from 'clarifai';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js'
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import './App.css';

const app = new Clarifai.App({
 apiKey: '3850e190f0504aae85707e177bcf0b17'
});

const particlesOptions={
    particles: {
      number:{
        value:30,
        density:{
          enable:true,
          value_area:800
        }
      }
    }
  }


class App extends Component {
  constructor(){
    super();
    this.state ={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false
    }
  }

/*componentDidMount(){
  fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(console.log)
}*/

calculateFaceLocation = (data) =>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  };
}

displayFaceBox = (box) =>{
  this.setState({box: box})
}

 onInputChanged = (event) =>{
   this.setState({input: event.target.value});
 }

 onButtonSubmitted = () =>{
   this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
 }

 onRouteChange = (route) =>{
    if(route === 'signout'){
        this.setState({isSignedIn: false});
      }else if(route === 'home'){
        this.setState({isSignedIn: true});
      }
    this.setState({route: route});
}
  render() {
    const {isSignedIn, route, imageUrl, box} = this.state;
    return (
      <div className="App">
      <Particles className='particles'
              params={particlesOptions}
            />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChanged} onButtonSubmit={this.onButtonSubmitted}/>
              <FaceRecoginiton box={box} imageUrl={this.state.imageUrl} />
           </div>
          :(route === 'signin')
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
        }
      </div>
    );
  }
}

export default App;
