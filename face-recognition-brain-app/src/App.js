import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecoginiton from './components/FaceRecoginiton/FaceRecoginiton';
import Clarifai from 'clarifai';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js'
import Rank from './components/Rank/Rank';

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
      imageUrl:''
    }
  }

 onInputChanged = (event) =>{
   this.setState({input: event.target.value});
 }

 onButtonSubmitted = () =>{
   this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
      this.state.input).then(
    function(response) {
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    },
    function(err) {
      // there was an error
    }
  );
 }

  render() {
    return (
      <div className="App">
      <Particles className='particles'
              params={particlesOptions}
            />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChanged} onButtonSubmit={this.onButtonSubmitted}/>
        <FaceRecoginiton imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
