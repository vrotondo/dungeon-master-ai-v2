#!/usr/bin/env python3
"""
Test script to verify Google Gemini API is working and list available models
"""
import os
import google.generativeai as genai

def test_gemini_api():
    try:
        # Get API key
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            api_key = "AIzaSyBCAfXLrErxnxlsaF1jM8dS0FHtwY4LnJI"  
        
        if not api_key or api_key == "YOUR_GOOGLE_API_KEY_HERE":
            print("❌ Error: Please set your Google API key")
            print("Set environment variable: export GOOGLE_API_KEY='your_key_here'")
            print("Or replace 'YOUR_GOOGLE_API_KEY_HERE' in this script with your actual key")
            return False
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Test with the recommended current model
        print("🧪 Testing with gemini-1.5-flash...")
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content("Say hello and confirm you are Google Gemini")
            print("✅ Success! Gemini API is working with gemini-1.5-flash")
            print(f"📝 Response: {response.text}")
            return True
        except Exception as e1:
            print(f"❌ gemini-1.5-flash failed: {e1}")
            
            # Try gemini-1.5-pro as fallback
            print("🧪 Trying gemini-1.5-pro...")
            try:
                model = genai.GenerativeModel('gemini-1.5-pro')
                response = model.generate_content("Say hello and confirm you are Google Gemini")
                print("✅ Success! Gemini API is working with gemini-1.5-pro")
                print(f"📝 Response: {response.text}")
                return True
            except Exception as e2:
                print(f"❌ gemini-1.5-pro failed: {e2}")
                print(f"❌ Both models failed: {e1}, {e2}")
                return False
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\nPossible issues:")
        print("1. Invalid API key")
        print("2. Network connection problems")
        print("3. API quota exceeded")
        print("4. Model name changed - check available models above")
        return False

if __name__ == "__main__":
    test_gemini_api()