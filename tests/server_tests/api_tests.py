#!/usr/bin/env python3

import unittest
import requests

TEST_URL="http://localhost:3000"
TEST_CONTENT= "tests/server_tests/test_content"

class TestGetCalls(unittest.TestCase):
    def test_GetCards(self):
        """Check that the request connects and that it returns a status code"""
        r = requests.get(TEST_URL+"/card/")
        self.assertEqual(r.status_code, 200)
        r_json = r.json()
        self.assertTrue(len(r_json)!=0)

    def test_GetCard(self):
        """Check that getting a single card connects and gives intended the fields"""
        r = requests.get(TEST_URL+"/card/")
        r_json = r.json();
        card_id = r_json[0]["_id"]
        c_r = requests.get(TEST_URL+"/card/"+card_id)

        self.assertEqual(c_r.status_code, 200)
        self.assertTrue("media" in c_r.json())

    def test_UploadFileImage(self):
        """Check that uploading a file works"""
        with open(TEST_CONTENT+"/test_1.svg", 'rb') as testimg:
            files = { 'file':('test_1.svg', testimg, 'image/svg+xml')}
            r = requests.post(TEST_URL+"/upload", files=files)

        self.assertEqual(r.status_code, 200)
        r_json = r.json()

        self.assertTrue('url' in r_json)
        self.assertTrue('media_type' in r_json)

        img_path = r_json['url'].split('/')
        self.assertEqual(img_path[0], 'static')
        self.assertEqual(img_path[1], 'image')
        self.assertEqual(len(img_path[2]), 64)

        media_type = r_json['media_type']
        self.assertEqual(media_type, 'image')

    def test_UploadFileVideo(self):
        with open(TEST_CONTENT+"/test_2.webm", 'rb') as testimg:
            files = { 'file':('test_2.webm', testimg, 'video/webm')}
            r = requests.post(TEST_URL+"/upload", files=files)

        self.assertEqual(r.status_code, 200)
        r_json = r.json()

        self.assertTrue('url' in r_json)
        self.assertTrue('media_type' in r_json)

        img_path = r_json['url'].split('/')
        self.assertEqual(img_path[0], 'static')
        self.assertEqual(img_path[1], 'video')
        self.assertEqual(len(img_path[2]), 64)

        media_type = r_json['media_type']
        self.assertEqual(media_type, 'video')

    def test_CreateCard(self):
        """Check that creating a file works"""

        pre_num_cards = len(requests.get(TEST_URL+'/card').json())
        with open(TEST_CONTENT+"/test_1.svg", 'rb') as testimg:
            files = { 'file':('test_1.svg', testimg, 'image/svg+xml')}
            ret_json = requests.post(TEST_URL+"/upload",
                    files=files).json()
            imgpath = ret_json['url']
            filetype = ret_json['media_type']

        media_list = []
        media_list.append({'type':filetype, 'url':imgpath})
        media_list.append({'type':'text', 'text':'ASL'})
        media_list.append({'type':'text', 'text':'American Sign Language (ASL) is a natural language that serves as the predominant sign language of Deaf communities'})
        r = requests.post(TEST_URL+'/card', json={'media':media_list})
        
        resp_text = r.text.strip('"')
        print(resp_text)
        self.assertEqual(r.status_code, 200)
        #get the card

        new_num_cards = len(requests.get(TEST_URL+'/card').json())
        self.assertEqual(pre_num_cards+1, new_num_cards)
        r = requests.get(TEST_URL+'/card/'+resp_text)
        self.assertEqual(r.status_code, 200)
        returned_card = r.json()
        self.assertTrue('media' in returned_card)
        self.assertEqual(len(returned_card['media']), 3)
        media = returned_card['media']
        self.assertTrue('type' in media[0])
        self.assertTrue('type' in media[1])
        self.assertTrue('type' in media[2])
        self.assertEqual(media[0]['type'], 'image')
        self.assertEqual(media[1]['type'], 'text')
        self.assertEqual(media[2]['type'], 'text')
        self.assertTrue('url' in media[0])
        self.assertTrue('text' in media[1])
        self.assertTrue('text' in media[2])
    
    def test_getDecks(self):
        """Check that we can get all the decks"""

        r = requests.get(TEST_URL+'/deck')

        self.assertEqual(r.status_code, 200)

        decks = r.json()
        self.assertTrue(len(decks) != 0)
        self.assertTrue("_id" in decks[0])
        self.assertTrue("title" in decks[0])
        self.assertTrue("desc" in decks[0])

    def test_getDeck(self):
        r = requests.get(TEST_URL+'/deck')
        deck_id = r.json()[0]["_id"]
        
        cards_r = requests.get(TEST_URL+'/deck/'+deck_id)
        
        self.assertEqual(cards_r.status_code, 200)
        cards = cards_r.json()
        self.assertTrue(len(cards) != 0)
        self.assertTrue(type(cards) is list)
    
    def test_makeDeck(self):
        cards = requests.get(TEST_URL+"/card/").json()
        card_ids = [c['_id'] for c in cards]

        req_json ={'title': 'Uploaded Deck', 'desc': 'An deck from the test '\
                'program', 'cards': card_ids, 'imgUrl': 'www.example.com' }

        r = requests.post(TEST_URL+'/deck', json=req_json)

        self.assertEqual(r.status_code, 200)
        self.assertTrue(len(r.text) != 0)
