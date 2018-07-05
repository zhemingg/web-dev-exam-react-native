import React from 'react';
import {ScrollView, Text, View, TextInput, Alert} from  'react-native';
import {Button, FormLabel, FormInput, CheckBox, Icon} from 'react-native-elements';
import TrueOrFalseQuestionServiceClient from "../servicesClient/TrueOrFalseQuestionServiceClient";

export default class TrueOrFalseQuestionEditor extends React.Component{
    static navigationOptions = {title: 'TrueOrFalseQuestionEditor'};
    constructor(props){
        super(props);
        this.state = {
            question: {
                id: '',
                title: '',
                points: '',
                description: '',
                questionType: 'trueOrFalseQuestion',
                isTrue: false
            },
            preview: false,
            type: '',
            examId: '',
        }

        this.TrueOrFalseQuestionServiceClient = TrueOrFalseQuestionServiceClient.instance;
        this.viewMode = this.viewMode.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.saveOrUpdate = this.saveOrUpdate.bind(this);
        this.renderTrueOrFalse = this.renderTrueOrFalse.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        const examId = navigation.getParam("examId");
        const type = navigation.getParam("type");
        const question = navigation.getParam("question");
        this.setState({type});
        this.setState({examId})
        if (type === 'update') {
            this.setState({question})
        }
    }

    saveOrUpdate(type) {
        var ref = this.props.navigation.getParam('findAll');
        if (type === 'create') {
            return this.createQuestion(this.state.question).then(() => ref(this.state.examId))
        } else {
            return this.updateQuestion(this.state.question).then(() => ref(this.state.examId))
        }

    }

    createQuestion(question) {
        return this.TrueOrFalseQuestionServiceClient
            .createTrueOrFalseQuestion(this.state.examId, question);

    }

    updateQuestion(question) {
        return this.TrueOrFalseQuestionServiceClient
            .updateTrueOrFalseQuestion(question.id, question);
    }

    deleteQuestion() {
        if (this.state.question.id !== '') {
            let ref = this.props.navigation.getParam('findAll');
            return this.TrueOrFalseQuestionServiceClient
                .deleteTrueOrFalseQuestion(this.state.question.id).then(() => ref(this.state.examId));
        }
    }

    renderTrueOrFalse(){
        return(
            <View>
                <CheckBox
                    center
                    onPress={
                        () => {
                            let question = this.state.question;
                            question.isTrue = true;
                            this.setState({question})
                            console.log(this.state.question)
                        }
                    }
                    title={'true'}
                    checked={true === this.state.question.isTrue}
                />

                <CheckBox
                    center
                    onPress={
                        () => {
                            let question = this.state.question;
                            question.isTrue = false;
                            this.setState({question})
                        }
                    }
                    title={'false'}
                    checked={false === this.state.question.isTrue}
                />
            </View>
        )
    }

    viewMode(isPreview){
        if(isPreview) {
            return (
                <View>
                    <Text>Preview</Text>
                    <Text>{this.state.question.title}</Text>
                    <Text>{this.state.question.points}</Text>
                    <Text>{this.state.question.description}</Text>
                    {this.renderTrueOrFalse()}
                </View>
            )
        } else {
            return (
                <View>
                    <FormLabel>Question Title</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let question = this.state.question;
                        question.title = text;
                        this.setState({question: question})
                    }}
                               placeholder={'Please add title'}
                               value={this.state.question.title}/>

                    <FormLabel>Question Points</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let question = this.state.question;
                        question.points = text;
                        this.setState({question: question})
                    }}
                               placeholder={'Please set points'}
                               value={this.state.question.points}/>

                    <FormLabel>Question Description</FormLabel>
                    <TextInput
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(text) => {
                            let question = this.state.question;
                            question.description = text;
                            this.setState({question: question})
                        }}
                        placeholder={'Please add description'}
                        value={this.state.question.description}/>
                    {this.renderTrueOrFalse()}
                    <Button title="Cancel Modify"
                            onPress={() => (this.props.navigation.goBack())}/>
                    <Button title="Delete Question"
                            onPress={() => {
                                (this.deleteQuestion())
                                this.props.navigation.goBack()
                            }}/>
                    <Button title="Submit"
                            onPress={() => {
                                this.saveOrUpdate(this.props.navigation.getParam('type'))
                                this.props.navigation.goBack()
                            }}/>
                </View>
            )
        }
    }

    render(){
        {console.log(this.state)}
        return(
            <ScrollView>
                <Button title="Preview"
                        onPress={() => this.setState({preview: !this.state.preview})}/>
                {this.viewMode(this.state.preview)}
            </ScrollView>
        )
    }

}