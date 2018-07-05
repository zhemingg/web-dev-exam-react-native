import React from 'react';
import {StatusBar, ScrollView, View} from 'react-native';
import FixedHeader from '../elements/FixedHeader';
import {Button} from 'react-native-elements';
import CourseList from '../components/CourseList';

export default class Home extends React.Component {
    static navigationOptions = {
        title: 'Home'
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ScrollView>
                <StatusBar barStyle="light-content"/>
                <FixedHeader/>
                    <Button title="Courses"
                            onPress={() => this.props.navigation
                                .navigate('CourseList')}
                            buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                    />
                <Button title="Go to WidgetList"
                        onPress={() => this.props.navigation
                            .navigate('WidgetList', {topicId: 32})}
                        buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                />
            </ScrollView>
        )
    }

}