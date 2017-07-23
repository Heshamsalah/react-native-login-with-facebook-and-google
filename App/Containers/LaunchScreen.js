import React, { Component } from 'react'
import { ScrollView, Text, Image, View, Button } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'
import { Images } from '../Themes'
import Reactotron from 'reactotron-react-native'
import { LoginButton, AccessToken } from 'react-native-fbsdk'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
   this._setupGoogleSignin();
  }

  render () {
      if(!this.state.user){
        return(
          <View>
            <GoogleSigninButton
              style={{width: 312, height: 48}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => this._signIn() }/>

            <LoginButton
              publishPermissions={["publish_actions"]}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    alert("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    alert("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        alert(data.accessToken.toString())
                        Reactotron.log(data);
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => alert("logout.")}/>
          </View>

        )
      }

      if(this.state.user){
        return(
          <View>
            <Text> Signed in</Text>
            <Button
              title="Sign Out"
              onPress={() => this._signOut()}>
              <Text>Sign out</Text>
            </Button>
            <Button
              title="Get token"
              onPress={() => this._getUserToken()}>
              <Text>Token</Text>
            </Button>
            <Text> {this.state.user.accessToken} </Text>
          </View>
        )
      }
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        //webClientId: <FROM DEVELOPER CONSOLE>, // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      Reactotron.log(user);
      this.setState({user});
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  _getUserToken(){
    const user = GoogleSignin.currentUser();
    Reactotron.log(user);
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      Reactotron.log(user);
      this.setState({user: user});
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({user: null});
    })
    .done();
  }
}
