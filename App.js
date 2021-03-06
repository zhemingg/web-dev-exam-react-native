import React from 'react';
import {StyleSheet} from 'react-native';
import Home from "./components/Home";
import CourseList from "./components/CourseList"
import { createStackNavigator } from 'react-navigation'
import ModuleList from "./components/ModuleList";
import LessonList from "./components/LessonList";
import TopicList from "./components/TopicList";
import WidgetList from "./components/WidgetList";
import AssignmentWidget from "./elements/AssignmentWidget";
import ExamWidget from "./elements/ExamWidget";
import MultipleChoiceQuestionEditor from "./elements/MultipleChoiceQuestionEditor";
import EssayQuestionEditor from "./elements/EssayQuestionEditor";
import FillInTheBlankQuestionEditor from "./elements/FillInTheBlankQuestionEditor";
import TrueOrFalseQuestionEditor from "./elements/TrueOrFalseQuestionEditor";

const App = createStackNavigator({
    Home,
    CourseList,
    ModuleList,
    LessonList,
    TopicList,
    WidgetList,
    AssignmentWidget,
    ExamWidget,
    MultipleChoiceQuestionEditor,
    EssayQuestionEditor,
    FillInTheBlankQuestionEditor,
    TrueOrFalseQuestionEditor

});

export default App;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
