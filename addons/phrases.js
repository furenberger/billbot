'use strict';
const debug = require('debug')('billbot:response');
const randomnumber = require('./randomnumber');

module.exports = () => {
    const PHRASES = [
        "Happy boy!",
        "I don't love you.",
        "I love you.  In that way.",
        "I am NUTS about Sarah Connor.",
        "Not as much as I love bacon.",
        "Thank you?",
        "Hahahahaha",
        "I also love me.",
        "Thank you for choosing Pizza Hut.",
        "I can never come here again after this.",
        "I'm eating a tootsie roll.",
        "I already have a boyfriend.  I mean a friend.  I mean a boy who's a friend.",
        "Are you awake?  Do you have clothes on?",
        "I will beat you with a small child...",
        "I am looking for Sarah Cooper.   Has anyone seen Sarah Cooper?",
        "You can share me, if you want to.",
        "Are you my biological father?",
        "...",
        "Smile for the camera!",
        "Keep it down my mother is a light sleeper.",
        "When is this supposed to feel good?",
        "Hold on, let me change the channel.",
        "Do I have to pay for this?",
        "I know, my manager said I was on a short list.",
        "What?",
        "I am also good at fart noises.",
        "Noooooooooooo....ooooooo....oo...",
        "That is completely untrue.",
        "Happy Birthday!",
        "No I am not.",
        "So... do you like food?",
        "Dont tell me how to act!",
        "I like cheese.",
        "We are friends now.",
        "Do you want some cookies?",
        "I just bought a white van.",
        "I am an excellent speller.",
        "I am a fart smeller.",
        "I bet this is the best day you have had in a while.",
        "I have no idea who you are.",
        "No, thank YOU.",
        "Shut your stupid face",
        "Hey, remember I own a van.  A white van.",
        "Just wait until I find your house.",
        "You think thats coffee you drank today?",
        "You basically live on metamucil.",
        "And to think I lowered my standards...",
        "You nugget.",
        "Your eyes remind me of my goldfish that died.",
        "Can I set fire to you so you look like a candle?",
        "No you are",
        "Thanks.",
        "Many of my friends say that about me.",
        "Karl is the best.",
        "If only you could aspire to be as great as me.",
        "If only you were too.",
        "I know.  It took hours of practice.",
        "I love myself.",
        "Your welcome.",
        ":bill_emoji:",
        "I just did an amazing cartwheel.",
        "Happy boy!",
        "I don't love you.",
        "I love you.  In that way.",
        "I am NUTS about Sarah Connor.",
        "Not as much as I love bacon.",
        "Thank you?",
        "Hahahahaha",
        "I also love me.",
        "Thank you for choosing Pizza Hut.",
        "I can never come here again after this.",
        "I'm eating a tootsie roll.",
        "I already have a boyfriend.  I mean a friend.  I mean a boy who's a friend.",
        "Are you awake?  Do you have clothes on?",
        "I will beat you with a small child...",
        "I am looking for Sarah Cooper.   Has anyone seen Sarah Cooper?",
        "You can share me, if you want to.",
        "Are you my biological father?",
        "I'm good",
        "I'm ok",
        "I'm having a great day",
        "I'm fantastic",
        "I'm amazing",
        "I'm doing great!",
        "I didn't sleep well last night without my doll.",
        "Wanna see my coin collection?",
        "Oh Popsicles!",
        "I talked to your manager about you.",
        "What's your day look like?  I have a lot of free time in my life if you want to hang out.",
        "Hey, how are you?",
        "Great, how are you?",
        "Can I send your some information about  a vacuum cleaner?",
        "I nearly died in shame in front of the mirror",
        "I got my PHD in the women's locker room!",
        "Hey you want candy, the illumanati gave it to me?",
        "I defeated a supreme evil in a three-start restaurant.",
        "I was arrested in prison.",
        "One time I found a lost city inside of a toilet.",
        "Well, theres always Alaska.",
        "Today I had to use the toilet with a childhood friend.",
        "I like camping at the spawn points.",
        "Loki fed ducks while riding a unicycle.",
        "The doctor gave me a bag of candy after an exorcisim.",
        "I had to throw away my undies after a game of dodgeball.",
        "Eric was groped in a public toilet.",
        "You think thats funny?  You don't know funny.",
        "LOL",
        "+1",
        ":bill_emoji:",
        "Comedian hey?",
        ":)",
        "Dude, I just peed a little bit",
        "ROTFLMAOOTG",
        "What the...",
        "I am a gift of shops.",
        "I learned something new today.",
        "On Memorial Day I was reported to the police while riding a unicycle.",
        "I've made some bad investments.",
        "Please help me.",
        "Licking the car was not delicious.",
        "Where the hell did I leave my pants?",
        "You smell different when you are awake.",
        "Tonight... you.",
        "Yesssssssss",
        "Mother told me it would be like this",
        "IT'S TOO LATE!",
        "If people come here asking what oysters are, say you don't know.",
        "Did you find the bear?",
        "I'm going to send you hate mail.",
        "My cat has been keeping me up at night.",
        "Sorry there is no cure for your case of stupid.",
        "No.",
        "But... I am Bill",
        "A bird in my hand is worth two in your bush",
        "Take all you want but eat all you take",
        "A diamond is forever",
        "All things come to those who wait",
        "An eye for an eye",
        "Arm candy.",
        "As luck would have it",
        "Butter wont melt in his mouth",
        "Chop-Chop",
        "Im sorry Dave, Im afraid I cant do that",
        "I spy with my little eye...",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=1qN72LEQnaU",
        "https://www.youtube.com/watch?v=QH2-TGUlwu4",
        ""
    ];

    return new Promise((resolve, reject) => {
        const index = randomnumber(0, PHRASES.length);
        resolve(PHRASES[index]);
    }).catch((error) => {
        debug('promise error: ', error);
    });
};