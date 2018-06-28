import React from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView } from 'react-native';
import FixedHeader from '../elements/FixedHeader';
import {Button} from 'react-native-elements';
import CourseList from '../components/CourseList';
import WidgetList from '../components/WidgetList'

export default class Home extends React.Component{
    static navigationOptions = {
        title: 'Home'
    }

    constructor(props) {
        super(props)
    }

    render(){
        return (
            <ScrollView>
                <StatusBar barStyle="light-content"/>
                <FixedHeader/>
                <Button title="Courses"
                        onPress={() => this.props.navigation
                            .navigate('CourseList')} />


                <Button title="Go to WidgetList"
                        onPress={() => this.props.navigation
                            .navigate('WidgetList')}/>
                <Button title="Go to AssignmentWidget"
                        onPress={() => this.props.navigation
                            .navigate('AssignmentWidget')}/>
            </ScrollView>
        )
    }

}