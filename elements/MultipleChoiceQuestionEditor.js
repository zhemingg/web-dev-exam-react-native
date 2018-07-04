import React from 'react';
import {ScrollView, Text, TextInput, Alert, View} from 'react-native';
import {FormLabel, FormInput, Button, CheckBox} from  'react-native-elements';
import MultipleChoiceQuestionServiceClient from "../servicesClient/MultipleChoiceQuestionServiceClient";

export default class MultipleChoiceQuestionEditor extends React.Component{
    static navigationOptions = {title: 'MultipleChoiceQuestionEditor'};
    constructor(props){
        super(props);
        this.state = {
            question: {
                id: '',
                title: '',
                points: '',
                description: '',
                choices:[],
                correctChoice:'',
                questionType:'multipleChoiceQuestion'
            },
            tempChoice: '',
            preview: false,
            type:'',
            examId:'',

        }
        this.MultipleChoiceQuestionServiceClient = MultipleChoiceQuestionServiceClient.instance;
        this.saveOrUpdate = this.saveOrUpdate.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.setCorrectChoice = this.setCorrectChoice.bind(this);
        this.renderChoice = this.renderChoice.bind(this);
        this.viewMode = this.viewMode.bind(this);
        this.checkValidOfChoice = this.checkValidOfChoice.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this)
    }


    componentDidMount() {
        const {navigation} = this.props;
        const examId = navigation.getParam("examId");
        const type = navigation.getParam("type");
        const question = navigation.getParam("question");
        this.setState({type});
        this.setState({examId})
        if (type === 'update'){
            this.setState({question})
        }


    }

    saveOrUpdate(type) {
        var ref = this.props.navigation.getParam('findAll');
        if (type === 'create') {
            return this.createQuestion(this.state.question).then(() => ref(this.state.examId))
        } else {
            return this.updateQuestion(this.state.question).then(() =>ref(this.state.examId))
        }

    }

    createQuestion(question){
        return this.MultipleChoiceQuestionServiceClient
            .createMultipleChoiceQuestion(this.state.examId, question);

    }

    updateQuestion(question){
        return this.MultipleChoiceQuestionServiceClient
            .updateExam(question.id, question);
    }

    deleteQuestion(){
        if(this.state.question.id !== '') {
            let ref = this.props.navigation.getParam('findAll');
            return this.MultipleChoiceQuestionServiceClient
                .deleteMultipleChoiceQuestion(this.state.question.id).then(() => ref(this.state.examId));
        }
    }

    addChoice(){
        let questions = this.state.question;
        let choices = questions.choices;
        choices.push(this.state.tempChoice);
        questions.choices = choices;
        this.setState({questions});
    }

    setCorrectChoice(choice){
        let questions = this.state.question;
        questions.correctChoice = choice;
        this.setState({questions});
    }

    checkValidOfChoice(){
        if (this.state.tempChoice === ''){
            Alert.alert('The choice can not be empty');
            return false;
        }
        let choices = this.state.question.choices;

        if (choices.indexOf(this.state.tempChoice) !== -1){
            Alert.alert('The choice already added');
            return false;
        }
        return true;
    }

    viewMode(isPreview){
        if(isPreview){
            return (
                <View>
                    <Text>Preview</Text>
                    <Text>{this.state.question.title}</Text>
                    <Text>{this.state.question.points}</Text>
                    <Text>{this.state.question.description}</Text>
                    {this.renderChoice()}
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

                    <FormLabel>New Choice</FormLabel>
                    <FormInput onChangeText={(text) => {
                        this.setState({tempChoice: text})
                    }}
                               placeholder={'Please add a new Choice'}
                               value={this.state.question.tempChoice}/>
                    <Button title="Add a choice"
                            onPress={() => {
                                if (this.checkValidOfChoice()){
                                    this.addChoice();
                                }
                            }}/>
                    <Button title="Cancel Modify"
                            onPress={() => (this.props.navigation.goBack())}/>
                    <Button title="Delete Question"
                            onPress={() => {(this.deleteQuestion())
                                this.props.navigation.goBack()
                            }}/>
                    <Button title="Save"
                            onPress={() => {
                                this.saveOrUpdate(this.props.navigation.getParam('type'))
                                this.props.navigation.goBack()}}/>
                    {this.renderChoice()}
                </View>
            )
        }
    }

    renderChoice(){
        return (
            this.state.question.choices.map(
                (choice, index) => (
                    <CheckBox key={index}
                              title={choice}
                              checkedIcon = 'dot-circle-o'
                              uncheckedIcon = 'circle-o'
                              containerStyle={this.state.question.correctChoice === choice && {backgroundColor:'lightskyblue'}}
                              onPress = {() => this.setCorrectChoice(choice)}
                              checked = {this.state.question.correctChoice === choice}
                    />

                )
            )
        )

    }

    render(){
        return (
            <ScrollView>
                <Button title="Preview"
                        onPress={() => this.setState({preview: !this.state.preview})}/>
                {this.viewMode(this.state.preview)}

            </ScrollView>
        )
    }

}