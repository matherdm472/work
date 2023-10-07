import tweepy

api_key = "b3M1QuVWeNW8Lw6E333AexLpb"
api_secret = "uIrTA1EAe4RzOpwxZXLQANkegzbtZ6wkGaCjd7eWvuiL7wHcry"
access_token = "1682780326978781186-yAekpPOIkPlZULtnuCLRHwTlMPvJTv"
access_secret = "J6p15DytVOmRIbFwt2zBbOB21fe73H2lbP8OKcL6Np33a"
consumer_key = "d0hnMHp4SXM4bzhsZklYVU8zbkw6MTpjaQ"
consumer_secret = "ZvbRnY28wsqoUuTQJ2SEUTnBCDPLZ6EZ_ihKiQth5Bofq2MLpG" 

# Authenticate to Twitter
auth = tweepy.Client("AAAAAAAAAAAAAAAAAAAAALXSowEAAAAAdmoIgIdRD5ODupULmfwbPRT%2BcWA%3DaWRhzv72e7shPdutT3OusiA9ijRkRTmd0klUJUp4WQaptBKQyT")
#auth = tweepy.AppAuthHandler(consumer_key, consumer_secret)

api = tweepy.API(auth)

print("API Key:", api_key)
print("API Key Secret:", api_secret)
print("Access Token:", access_token)
print("Access Token Secret:", access_secret)

try:
    if (api.verify_credentials() == True):
        print('Successful Authentication')
    else:
        print('Failed Authentication')
    
    user = api.get_user('@KingJames') # Store user as a variable

    # Get user Twitter statistics
    user_id = "23083404"
    user = api.get_user(user_id)
    print(user.name)
except tweepy.errors.TweepyException as e:
    print(f'Error: {e.response.text}')
