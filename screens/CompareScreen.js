import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Button, Icon } from 'react-native-elements'
import Colors from '../constants/Colors';

// Theme colors! (if you change these, you need to change them in all the screens)
var darkest_blue = '#0C0F2A';
var medium_blue = '#667797';
var light_blue = '#C9DCED';
var yellow = '#FAF57E';
var white = '#FFFFFF';

var number_slides = 5;
var logo = require('../images/puzzle_piece.png')
var constructed = 0

const combined_notes = [{
  "id": 1,
  "slide_title": "Sony Google TV Remote",
  "notes": ["hall of shame", "by Sony"]
}, {
  "id": 2,
  "slide_title": "Design Thinking",
  "notes": ["used by IDEO", "what CS147 is all about", "d.school"]
}, {
  "id": 3,
  "slide_title": "Ideate",
  "notes": ["middle step", "after needfinding", "before prototyping"]
}, {
  "id": 4,
  "slide_title": "Test",
  "notes": ["user studies", "there's no right answer", "just make sure it works"]
}, {
  "id": 5,
  "slide_title": "Point of View",
  "notes": ["use open-ended questions", "people always make sense to themselves"]
}]

export default class NotableScreen extends Component {
  constructor(props) {
    super(props);
    for (var i = 0; i < number_slides; i++) {
      this.state = {[i]: ' '};
    }
    this._loadStoredText();
    // console.log("done in compare constructor")
  }

  // loads personal notes from database
  _loadStoredText = async () => {
    try {
      for (let i = 0; i < number_slides; i++) {
        var value = i.toString();
        var storedText = await AsyncStorage.getItem(value);
        if (storedText != null && storedText != undefined) {
          this.setState({[i]: storedText});
        } else {
          this.setState({[i]: []});
        }
      }
    } catch (error) {
      console.log('Error fetching stored notes from AsyncStorage')
    }
  }
  static navigationOptions = {
    header: () => null,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.route_index == 0) {
      this._loadStoredText()
    }
  }

  one_slide_array_of_buttons = (slide_index) => {
    var combined_slide_notes = combined_notes[slide_index]
    var buttons_array = []
    for (let i = 0; i < combined_slide_notes.notes.length; i++) {
      buttons_array.push(
        <Button
          key={(slide_index) * 100 + i}
          onPress={
            () => {
              var curr_notes = this.state[slide_index] + "\n" + combined_slide_notes.notes[i];
              this.setState(
                { [slide_index]: curr_notes },
                () => {
                  try {
                    var value = i.toString();
                    AsyncStorage.setItem(value, this.state[slide_index]);
                  } catch (error) {
                    alert('AsyncStorage error: ' + error.message);
                  }
                }
              );
            }
          }
          title={combined_slide_notes.notes[i]}
          color="#841584"
        />
      );
    }
    return (buttons_array);
  }

  one_slide_of_class_notes = (slide_index) => {
    var combined_slide_notes = combined_notes[slide_index]
    return (

      <View key={slide_index+" outer"}>
          <View key={slide_index+" title"} style={styles[slide_index%4]}>
            <Text style={styles.text_format}> {combined_slide_notes.slide_title} </Text>
          </View>
          <View key={slide_index+" all notes"} style={styles.card}>
            <View style={[styles.box, styles.box1]}>
              <Text style={styles.notes_text}> {this.state[slide_index]} </Text>
            </View>
            <View style={[styles.box, styles.box2]}>
              { this.one_slide_array_of_buttons(slide_index) }
            </View>
          </View>
        </View>
    );


      /*(<View key={slide_index} style={styles.card}>
          <Text> {combined_slide_notes.slide_title} </Text>
          { this.one_slide_array_of_buttons(slide_index) }
        </View> )*/
  }

  // adds buttons for each
  // TODO: turn class notes into array & make buttons for each
  render() {
    var personal_notes = [];
    var class_notes = [];
    for (let i = 0; i < number_slides; i++) {
      var combined_slide_notes = combined_notes[i]
      class_notes.push(this.one_slide_of_class_notes(i));
      /*personal_notes.push( // iterate through state and create divs each time
        <View key={i} style={styles.card}>
          <Text> {combined_slide_notes.slide_title} </Text>
          <Text style={styles.notes_text}> {this.state[i]} </Text>
        </View>
        )*/

      /*
      class_notes.push(
        <View key={i+"hi"}>
          <View key={i+"sup"} style={styles.slideHeader}>
            <Text style={styles.text_format}> {combined_slide_notes.slide_title} </Text>
          </View>
          <View key={i+"yo"} style={styles.card}>
            <View style={[styles.box, styles.box1]}>
              <Text style={styles.notes_text}> {this.state[i]} </Text>
            </View>
            <View style={[styles.box, styles.box2]}>
              <Button key={i+"lol"} onPress={() => {
                var curr_notes = this.state[i] + "\n" + combined_notes[i].notes
                this.setState({ [i]: curr_notes }, () => {
                  try {
                    var value = i.toString();
                    AsyncStorage.setItem(value, this.state[i]);
                  } catch (error) {
                    alert('AsyncStorage error: ' + error.message);
                  }
                });}}
                title={combined_notes[i].notes}
                color="#841584"
              />
            </View>
          </View>
        </View>
        )
        */
    }
    // console.log("render was called in compare!")
    return (
      <View style={styles.container}>
        <View style={styles.padding_header}></View>
        <View style={styles.header}>
          <FontAwesome name="angle-right" size={45} color={Colors.noticeText} style={styles.leftSwipe}/>
          <Image style={styles.navBar} source={logo} resizeMode="contain" />
        </View>
        <View style={styles.context}>
            <View style={[styles.box, styles.box2]}>
              <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
                <View style={styles.title_text}>
                  <Text style={[styles.box, styles.my_notes]}>My Notes</Text>
                  <Text style={[styles.box, styles.my_notes]}>Class Notes</Text>
                </View>
                {class_notes}
              </ScrollView>
            </View>
        </View>
      </View>
    );
  }

  saveNotes = async () => {
    console.log('attempting to save notes in compare');
    try {
      for (let i = 0; i < number_slides; i++) {
        await AsyncStorage.setItem(i.toString(), this.state[i]);
      }
    } catch (error) {
      console.log('Unable to save notes to AsyncStorage')
    }
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navBar: {
    flex: 1,
    paddingTop: 30,
    height: 64,
    backgroundColor: '#eae8e8',
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth:.5,
    borderColor:'#b2bab7',
    backgroundColor: '#eae8e8',
  },
  padding_header: {
    height: 20,
    flexDirection: 'column',
    backgroundColor: '#eae8e8',
  },
  title_text: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    alignSelf:'center',
    // borderWidth:2,
    // borderColor:'#b2bab7',
    // borderWidth:1,
    // backgroundColor: '#f2f7f5',
  //  width: 350,
    height: 30,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    alignSelf:'center',
    // borderWidth:2,
    // borderColor:'#b2bab7',
    // borderWidth:1,
    backgroundColor: '#f4f7f6',
  //  width: 350,
    height: 300,
  },
  scrollContentContainer: {
    paddingTop: 30,
  },
  navBarButton: {
    color: '#FFFFFF',
    textAlign:'center',
    width: 64
  },
  navBarHeader: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  leftSwipe: {
    position: 'absolute',
    left: 15,
    top: 7,
  },
  context: {
    flex: 1,
    flexDirection: 'row'
  },
  box: {
    flex: 1,
  },
  box1: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    borderWidth:.5,
    borderColor:'#b2bab7',
    // backgroundColor: '#f4f7f6',
  },
  //content
  box2: {
    flex: 1,
    borderWidth:.5,
    borderColor:'#b2bab7',
    backgroundColor: '#f4f7f6',
    // backgroundColor: '#eff2f1',
  },
  slideHeader: {
    flex: 1,
    backgroundColor: 'skyblue',
    height: 30,
    width: 700,
    alignSelf:'center',
  },
  text_format: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  my_notes: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  notes_text: {
    flexWrap:'wrap',
    flex: 1,
  }
});
