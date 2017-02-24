#!/usr/bin/env python3

import unittest
import requests

class TestGetCalls(unittest.TestCase):
    def test_GetCard(self):
        """Check that the request connects and that it returns a status code"""
        r = requests.get("http://localhost:3000/cards/")
        self.assertEqual(r.status_code, 200)
