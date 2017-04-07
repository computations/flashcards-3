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

        img_path = r.text.split('/')
        self.assertEqual(img_path[0], 'static')
        self.assertEqual(img_path[1], 'image')
        self.assertEqual(len(img_path[2]), 64)

    def test_CreateCard(self):
        """Check that creating a file works"""

        with open(TEST_CONTENT+"/test_1.svg", 'rb') as testimg:
            files = { 'file':('test_1.svg', testimg, 'image/svg+xml')}
            imgpath = requests.post(TEST_URL+"/upload",
                    files=files).text

        media_list = []
        media_list.append({'type':'image', 'url':imgpath})
        r = requests.post(TEST_URL+'/card', json={'media':media_list})
        
        resp_text = r.text
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(resp_text), 26)
    
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
    
    def test_makeDeck(self):
        cards = requests.get(TEST_URL+"/card/").json()
        card_ids = [c['_id'] for c in cards]

        req_json ={'title': 'Uploaded Deck', 'desc': 'An deck from the test '\
        'program', 'cards': card_ids }

        r = requests.post(TEST_URL+'/deck', json=req_json)

        self.assertEqual(r.status_code, 200)
        self.assertTrue(len(r.text) != 0)

