# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from email import message
from html import entities
from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests

#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

class ActionSearchRestaurant(Action):

    def name(self) -> Text:
        return "action_search_restaurant"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        entities = tracker.latest_message['entities']
        print(tracker.latest_message['entities'])
        message = ''
        for e in entities:
            if e['entity'] == 'hotel':
                name = e['value']
            if name == 'india':
                message = 'india'
            if name == 'vietnam':
                message = 'vietnam'
            else:
                message = name
                

        print('From python file')
        dispatcher.utter_message(text=message)

        return []

class ActionCoronaTracker(Action):

    def name(self) -> Text:
        return "action_corona_tracker"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        response = requests.get('https://data.covid19india.org/data.json').json()


        entities = tracker.latest_message['entities']
        message = ''
        state = None
        for e in entities:
            if e['entity'] == 'state':
                state = e['value']

        print("State ", state) 
        #state = state.lower()     
        print("State ", state) 
        if state == "corona":
            state = "Total"
        if state == "india":
            state = "Total"   

        # print("State ", state.title())   
        message = "Please enter correct STATE name"
        if(state != None):
            message = "Please enter correct STATE name"
            for data in response["statewise"]:
                if data["state"] == state.title():
                    print(data)
                    message = "Active: "+data["active"] +" Confirmed: " + data["confirmed"] +" Recovered: " + data["recovered"] +" On "+data["lastupdatedtime"]

        dispatcher.utter_message(text=message)

        return []


class ActionFilterProduct(Action):

    def name(self) -> Text:
        return "action_filter_product"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        entities = tracker.latest_message['entities']
        condition = None
        for e in entities:
            if e['entity'] == 'prodFilter':
                condition = e['value']

        response = requests.get('https://kltn-watchwebsite.herokuapp.com/api/products/getByChat?value=' + condition).json()

        message = 'Không tìm thấy sản phẩm phù hợp'
        if len(response) != 0:
            message = 'Hi vọng các sản phẩm này phù hợp với mong muốn của quý khách \n'
            for link in response:
                message = message + link + '\n'


        dispatcher.utter_message(text=message)

        return []