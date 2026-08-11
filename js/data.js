/* ==========================================================================
   SpellQuest — Game Data
   Ported from spellquest.py: levels, achievements, ranks, realm scenes,
   bonus games, realm entries/farewells, challenge flavor text.
   ========================================================================== */

const LEVEL_DATA = {
  1: {
    name: "First Steps",
    realm: "Village of Letters",
    desc: "Simple three-letter words. Listen to the hint and spell the word!",
    rounds: [
      {type:"spell", prompt:"cat", hint:"A small pet that says meow.", answer:"cat",
       explain:"C-A-T. Think of the sounds: cuh — ah — tuh. Three letters, three sounds!"},
      {type:"spell", prompt:"dog", hint:"A pet that barks and wags its tail.", answer:"dog",
       explain:"D-O-G. D like door, O like octopus, G like goat."},
      {type:"spell", prompt:"sun", hint:"The big bright thing in the sky.", answer:"sun",
       explain:"S-U-N. S like snake, U like umbrella, N like nose."},
      {type:"spell", prompt:"hat", hint:"You put this on your head.", answer:"hat",
       explain:"H-A-T. Just three letters! H is for head."},
      {type:"spell", prompt:"bed", hint:"You sleep on this at night.", answer:"bed",
       explain:"B-E-D. B like ball, E like egg, D like door."},
      {type:"spell", prompt:"run", hint:"To move very fast with your feet.", answer:"run",
       explain:"R-U-N. R like rabbit, U like up, N like net."},
      {type:"spell", prompt:"big", hint:"The opposite of small. Like an elephant!", answer:"big",
       explain:"B-I-G. I makes the 'ih' sound here. Big elephant!"},
      {type:"spell", prompt:"red", hint:"The color of a strawberry.", answer:"red",
       explain:"R-E-D. Like the red light that means STOP."},
      {type:"choice_moment",
       prompt:"Two villagers approach you. The baker offers to teach you with rhymes. The blacksmith offers to teach you with stories.",
       options:[
         ["Help the Baker — learn with rhymes","baker"],
         ["Help the Blacksmith — learn with stories","blacksmith"]
       ],
       result:"The villager smiles warmly. 'Whatever path you take, the words are the same — only the telling changes.' They walk with you toward the next challenge."},
    ]
  },
  2: {
    name: "Building Words",
    realm: "Village of Letters",
    desc: "Four-letter words! You are getting stronger!",
    rounds: [
      {type:"spell", prompt:"fish", hint:"Swims in water. Has fins and scales.", answer:"fish",
       explain:"F-I-S-H. SH makes the 'shhh' sound. F like frog, I like igloo, SH like shhh!"},
      {type:"spell", prompt:"book", hint:"You read this. It has pages.", answer:"book",
       explain:"B-O-O-K. Two O's together make the 'oo' sound like in 'look' and 'cook'."},
      {type:"spell", prompt:"tree", hint:"A tall plant with leaves and a trunk.", answer:"tree",
       explain:"T-R-E-E. Two E's make the long 'ee' sound. Like 'see' and 'bee'!"},
      {type:"spell", prompt:"milk", hint:"A white drink that comes from cows.", answer:"milk",
       explain:"M-I-L-K. I makes 'ih'. L and K at the end."},
      {type:"spell", prompt:"star", hint:"A tiny light in the night sky.", answer:"star",
       explain:"S-T-A-R. ST together makes one sound. Then A-R."},
      {type:"spell", prompt:"hand", hint:"You have two of these. You use them to hold things.", answer:"hand",
       explain:"H-A-N-D. A makes 'ah'. N-D together at the end."},
      {type:"spell", prompt:"door", hint:"You open this to go into a room.", answer:"door",
       explain:"D-O-O-R. Two O's again! D-O-O-R — like 'floor' and 'poor'."},
      {type:"spell", prompt:"bird", hint:"An animal with wings and feathers.", answer:"bird",
       explain:"B-I-R-D. IR makes the 'ur' sound. Like 'girl' and 'first'."},
    ]
  },
  3: {
    name: "Word Explorer",
    realm: "Village of Letters",
    desc: "Everyday words you use all the time!",
    rounds: [
      {type:"spell", prompt:"house", hint:"The building where you live.", answer:"house",
       explain:"H-O-U-S-E. OU says 'ow'. The E at the end is silent — it just makes the O say its name."},
      {type:"spell", prompt:"water", hint:"You drink this every day. It's clear.", answer:"water",
       explain:"W-A-T-E-R. A says 'aw'. ER at the end."},
      {type:"spell", prompt:"happy", hint:"How you feel when you smile and laugh.", answer:"happy",
       explain:"H-A-P-P-Y. Two P's! Many people only write one P — don't forget the second one!"},
      {type:"spell", prompt:"friend", hint:"Someone you like to play with.", answer:"friend",
       explain:"F-R-I-E-N-D. I before E! This is a tricky word — many people write 'freind' by accident."},
      {type:"spell", prompt:"school", hint:"The place where you learn things.", answer:"school",
       explain:"S-C-H-O-O-L. SCH says 'sk'. Then O-O-L. Six letters!"},
      {type:"spell", prompt:"apple", hint:"A crunchy red or green fruit.", answer:"apple",
       explain:"A-P-P-L-E. Two P's again! Think of it as two parts: ap + ple."},
      {type:"spell", prompt:"music", hint:"Songs and sounds you love to hear.", answer:"music",
       explain:"M-U-S-I-C. The S sounds like a Z here: myoo-zik."},
      {type:"spell", prompt:"family", hint:"Your parents, brothers, and sisters together.", answer:"family",
       explain:"F-A-M-I-L-Y. I comes before L. Think: fam-i-ly — three little parts!"},
    ]
  },
  4: {
    name: "Tricky Trails",
    realm: "Forest of Sounds",
    desc: "Words that have tricky spellings. Listen carefully!",
    rounds: [
      {type:"spell", prompt:"because", hint:"A word that gives a reason why.", answer:"because",
       explain:"B-E-C-A-U-S-E. Remember this sentence: Big Elephants Can Always Understand Small Elephants! Each first letter spells BECAUSE."},
      {type:"choice_moment",
       prompt:"The forest path splits around an enormous fallen tree. Left leads through glowing mushrooms. Right leads across a stream on stepping-stones — but the stones have letters on them.",
       options:[
         ["Follow the mushroom path — quiet and steady","mushrooms"],
         ["Cross the stepping-stones — riskier but faster","stones"]
       ],
       result:"Both paths rejoin at the same clearing. The forest seems to approve of your decision, rustling its leaves in what might be applause."},
      {type:"spell", prompt:"beautiful", hint:"Something that looks very, very nice.", answer:"beautiful",
       explain:"B-E-A-U-T-I-F-U-L. Think of three parts: beau + ti + ful. The 'eau' makes the 'yoo' sound."},
      {type:"spell", prompt:"people", hint:"More than one person. Humans!", answer:"people",
       explain:"P-E-O-P-L-E. The O is silent! It sounds like 'peeple' but you write P-E-O-P-L-E. The E-O order is unusual."},
      {type:"choose", prompt:"This book belongs to Sam. It is ____ book.",
       options:["their","there","they're"], answer:"their",
       explain:"THEIR = belongs to them. THERE = a place. THEY'RE = they are. The book belongs to Sam, so it is THEIR book."},
      {type:"spell", prompt:"together", hint:"With each other, not apart.", answer:"together",
       explain:"T-O-G-E-T-H-E-R. Think of three little words stuck together: to + get + her!"},
      {type:"spell", prompt:"different", hint:"Not the same as something else.", answer:"different",
       explain:"D-I-F-F-E-R-E-N-T. Two F's! And an E before the R. Many people forget that E."},
      {type:"spell", prompt:"tomorrow", hint:"The day after today.", answer:"tomorrow",
       explain:"T-O-M-O-R-R-O-W. One M, two R's, one W. Think: tom + or + row."},
      {type:"spell", prompt:"enough", hint:"As much as you need. Sufficient.", answer:"enough",
       explain:"E-N-O-U-G-H. The GH at the end is silent! It sounds like 'enuff' but you write E-N-O-U-G-H."},
    ]
  },
  5: {
    name: "Silent Letters",
    realm: "Forest of Sounds",
    desc: "Words with letters you don't say out loud! Sneaky!",
    rounds: [
      {type:"spell", prompt:"know", hint:"To have something in your brain. Starts with a silent letter.", answer:"know",
       explain:"K-N-O-W. The K is silent! It sounds like 'no'. Like 'knee' and 'knife' — K is quiet at the start."},
      {type:"spell", prompt:"write", hint:"To put words on paper. Starts with a silent letter.", answer:"write",
       explain:"W-R-I-T-E. The W is silent! Sounds like 'rite'. Like 'wrong' and 'wrist'."},
      {type:"spell", prompt:"listen", hint:"To pay attention to sounds. Has a silent letter inside.", answer:"listen",
       explain:"L-I-S-T-E-N. The T is silent! Sounds like 'lissen'. Like 'castle' and 'whistle'."},
      {type:"spell", prompt:"island", hint:"Land with water all around it.", answer:"island",
       explain:"I-S-L-A-N-D. The S is silent! It sounds like 'iland'. The S is hiding in there!"},
      {type:"spell", prompt:"honest", hint:"Telling the truth. Starts with a silent letter.", answer:"honest",
       explain:"H-O-N-E-S-T. The H is silent! Sounds like 'on-est'. Like 'hour' and 'heir'."},
      {type:"choose", prompt:"I am going ____ the park to play.",
       options:["to","too","two"], answer:"to",
       explain:"TO = going somewhere. TOO = also, or very much. TWO = the number 2. You go TO a place."},
      {type:"spell", prompt:"knight", hint:"A warrior in shiny armor from old stories.", answer:"knight",
       explain:"K-N-I-G-H-T. TWO silent parts! K is silent AND GH is silent. Sounds like 'nite'. Six letters, only three sounds!"},
      {type:"spell", prompt:"thumb", hint:"The short, fat finger on your hand.", answer:"thumb",
       explain:"T-H-U-M-B. The B at the end is silent! Sounds like 'thum'. Like 'lamb' and 'climb'."},
    ]
  },
  6: {
    name: "Pattern Paths",
    realm: "Forest of Sounds",
    desc: "Words with special spelling rules and patterns.",
    rounds: [
      {type:"spell", prompt:"receive", hint:"To get something. Remember: I before E except after...", answer:"receive",
       explain:"R-E-C-E-I-V-E. I before E — EXCEPT after C! The C makes it E-I instead of I-E. Classic rule!"},
      {type:"spell", prompt:"believe", hint:"To think something is true. I before E?", answer:"believe",
       explain:"B-E-L-I-E-V-E. No C before it, so it's I-E! The rule works here."},
      {type:"spell", prompt:"neighbor", hint:"Someone who lives next door.", answer:"neighbor",
       explain:"N-E-I-G-H-B-O-R. EI makes the 'ay' sound. GH is silent. American spelling uses -OR at the end."},
      {type:"choose", prompt:"____ going to love this game!",
       options:["You're","Your"], answer:"You're",
       explain:"YOU'RE = you are. YOUR = belongs to you. 'You are going to love this' — so it's YOU'RE."},
      {type:"spell", prompt:"through", hint:"Moving from one side to the other side.", answer:"through",
       explain:"T-H-R-O-U-G-H. OUGH says 'oo'! Seven letters but it sounds like 'throo'!"},
      {type:"spell", prompt:"thought", hint:"An idea you had in the past.", answer:"thought",
       explain:"T-H-O-U-G-H-T. OUGH says 'aw'. Seven letters sounds like 'thawt'. Very tricky!"},
      {type:"spell", prompt:"weight", hint:"How heavy something is.", answer:"weight",
       explain:"W-E-I-G-H-T. EI says 'ay'. GH silent. Another 'i before e' exception!"},
      {type:"choose", prompt:"The cake was ____ big for one person.",
       options:["too","to","two"], answer:"too",
       explain:"TOO = very much, more than enough. 'Too big' means very big, more than needed."},
    ]
  },
  7: {
    name: "Rocky Roads",
    realm: "Mountain of Mastery",
    desc: "Words that even grown-ups often spell wrong! You can master them!",
    rounds: [
      {type:"spell", prompt:"necessary", hint:"Something you really need. One C, two S's.", answer:"necessary",
       explain:"N-E-C-E-S-S-A-R-Y. One C, two S's. Never Eat Cake, Eat Salad Sandwiches And Remain Young! Each first letter: N-E-C-E-S-S-A-R-Y."},
      {type:"choice_moment",
       prompt:"A mountain guide offers you a choice. You can take the rope ladder (faster but exposed to the wind) or the cave tunnel (slower but protected from the elements).",
       options:[
         ["Climb the rope ladder — brave the cold wind","ladder"],
         ["Go through the cave tunnel — steady and sheltered","cave"]
       ],
       result:"The guide nods. 'Both ways reach the summit. The only wrong choice is turning back.' They hand you a warm drink and gesture onward."},
      {type:"spell", prompt:"definitely", hint:"Without any doubt. No A in this word!", answer:"definitely",
       explain:"D-E-F-I-N-I-T-E-L-Y. Many write 'definately' — that's wrong! See the word 'finite' hiding inside? de-FINITE-ly."},
      {type:"spell", prompt:"separate", hint:"To pull things apart. There's 'a rat' inside.", answer:"separate",
       explain:"S-E-P-A-R-A-T-E. The middle is A, not E! Remember: there is A RAT in separate. sep-A-RAT-e!"},
      {type:"choose", prompt:"Please be ____ while the baby sleeps.",
       options:["quiet","quite"], answer:"quiet",
       explain:"QUIET = not loud. QUITE = very. They look similar but mean different things! QUI-E-T for silence."},
      {type:"spell", prompt:"environment", hint:"Nature all around us — air, water, trees.", answer:"environment",
       explain:"E-N-V-I-R-O-N-M-E-N-T. There is no 'iron'! It's 'viron'. And don't forget the N before M."},
      {type:"spell", prompt:"government", hint:"The group of people who run a country.", answer:"government",
       explain:"G-O-V-E-R-N-M-E-N-T. The N is silent! But you must write it: govern + ment."},
      {type:"spell", prompt:"independent", hint:"Free! Able to do things by yourself.", answer:"independent",
       explain:"I-N-D-E-P-E-N-D-E-N-T. Ends in ENT, not ANT. Think: in + depend + ent."},
      {type:"spell", prompt:"conscious", hint:"Awake and knowing what's happening around you.", answer:"conscious",
       explain:"C-O-N-S-C-I-O-U-S. The SCI makes a 'sh' sound! The I is easy to miss — don't skip it."},
    ]
  },
  8: {
    name: "Homophone Hunt",
    realm: "Mountain of Mastery",
    desc: "Words that sound exactly the same but mean different things!",
    rounds: [
      {type:"choose", prompt:"I'm going over ____ to see my friend.",
       options:["there (a place)","their (belongs to them)","they're (they are)"], answer:"there (a place)",
       explain:"THERE = a place. You're going TO a place, so it's THERE."},
      {type:"choose", prompt:"____ book is on the table.",
       options:["Your (belongs to you)","You're (you are)"], answer:"Your (belongs to you)",
       explain:"YOUR = belongs to you. The book belongs to you, so it's YOUR book."},
      {type:"choose", prompt:"I don't know ____ to go or stay.",
       options:["whether (if)","weather (rain, sun, wind)"], answer:"whether (if)",
       explain:"WHETHER = if (whether or not). WEATHER = rain and sunshine. You're choosing IF to go!"},
      {type:"choose", prompt:"She ate the ____ cake by herself!",
       options:["whole (entire)","hole (an opening)"], answer:"whole (entire)",
       explain:"WHOLE = complete, entire. She ate the ENTIRE cake, not a hole in the cake!"},
      {type:"choose", prompt:"I ____ the answer to this question!",
       options:["know (understand)","no (negative answer)"], answer:"know (understand)",
       explain:"KNOW = understand (K is silent!). NO = negative answer."},
      {type:"choose", prompt:"____ are you going?",
       options:["Where (what place)","Wear (put on clothes)","Were (past of are)"], answer:"Where (what place)",
       explain:"WHERE = what place. You're asking about a place!"},
      {type:"choose", prompt:"I want to go shopping, ____ I need to save money.",
       options:["but (however)","butt (the end of something)"], answer:"but (however)",
       explain:"BUT = however. BUTT with two T's is the end of something (like a cigarette butt). One T for 'however'!"},
      {type:"choose", prompt:"She has ____ many pets!",
       options:["two (the number 2)","too (very many)","to (direction)"], answer:"too (very many)",
       explain:"TOO = very. 'Too many' means very many, more than enough."},
    ]
  },
  9: {
    name: "Grammar Fixer",
    realm: "Mountain of Mastery",
    desc: "Find and fix the mistakes in these sentences!",
    rounds: [
      {type:"fix", wrong:"He go to school yesterday.",
       hint:"The word 'go' is wrong — it happened in the past.",
       right:"He went to school yesterday.",
       explain:"GO becomes WENT in the past. Yesterday tells us it already happened!"},
      {type:"fix", wrong:"She don't like apples.",
       hint:"With 'she', use a different word than 'don't'.",
       right:"She doesn't like apples.",
       explain:"With HE, SHE, or IT, we say DOESN'T. With I, YOU, WE, THEY, we say DON'T."},
      {type:"fix", wrong:"There is many people here.",
       hint:"Many people means more than one — use a different word than 'is'.",
       right:"There are many people here.",
       explain:"One person = there IS. Many people (more than one) = there ARE."},
      {type:"fix", wrong:"I have went to the store.",
       hint:"After 'have', 'went' is wrong. What's the other past form of go?",
       right:"I have gone to the store.",
       explain:"After HAVE or HAS, use GONE not WENT. I went (simple past). I have gone (with have)."},
      {type:"fix", wrong:"Me and my friend went out.",
       hint:"Always put the other person first, and use I not me at the start.",
       right:"My friend and I went out.",
       explain:"Always put yourself last: 'My friend and I'. Use I (not me) when you are doing the action."},
      {type:"fix", wrong:"I could of done that.",
       hint:"'Of' is not a verb! What word sounds like 'of' but is actually a verb?",
       right:"I could have done that.",
       explain:"People say 'could've' which sounds like 'could of'. But it's always COULD HAVE, SHOULD HAVE, WOULD HAVE!"},
      {type:"fix", wrong:"The dog wagged it's tail.",
       hint:"Check the apostrophe — does 'it's' mean 'belongs to it' or 'it is'?",
       right:"The dog wagged its tail.",
       explain:"ITS (no apostrophe) = belongs to it. IT'S (with apostrophe) = it is. The tail belongs to the dog — ITS tail."},
      {type:"fix", wrong:"Less people came than I expected.",
       hint:"People are countable — use a different word than 'less'.",
       right:"Fewer people came than I expected.",
       explain:"FEWER for things you can count (people, apples, cars). LESS for things you can't count (water, time, money)."},
    ]
  },
  10: {
    name: "Precision Spells",
    realm: "Tower of Eloquence",
    desc: "Impressive words that make your writing shine!",
    rounds: [
      {type:"spell", prompt:"exaggerate", hint:"To make something sound bigger than it really is.", answer:"exaggerate",
       explain:"E-X-A-G-G-E-R-A-T-E. Two G's! Think: ex + agg + erate. Don't skip the second G."},
      {type:"choice_moment",
       prompt:"The tower's clockwork owl tilts its brass head. 'I can guide you with historical examples from old books, or with modern examples from letters people write today. Which do you prefer?'",
       options:[
         ["Learn from old books — classic and formal","old_books"],
         ["Learn from modern letters — fresh and practical","modern"]
       ],
       result:"The owl's gears whir in approval. 'Excellent. Both traditions produce fine writers. Now — on to your first test.'"},
      {type:"spell", prompt:"embarrass", hint:"To feel shy or your face goes red.", answer:"embarrass",
       explain:"E-M-B-A-R-R-A-S-S. Two R's AND two S's! That's two double letters in one word!"},
      {type:"spell", prompt:"privilege", hint:"A special right or advantage. No D in this one!", answer:"privilege",
       explain:"P-R-I-V-I-L-E-G-E. No D! Many write 'priviledge' — wrong! Think: privi + lege."},
      {type:"choose", prompt:"This medicine may ____ your sleep.",
       options:["affect (verb — to change)","effect (noun — the result)"], answer:"affect (verb — to change)",
       explain:"AFFECT = verb, it means to change or influence. EFFECT = noun, it means the result. 'May affect' needs a verb."},
      {type:"spell", prompt:"rhythm", hint:"The beat in music. No regular vowels!", answer:"rhythm",
       explain:"R-H-Y-T-H-M. The longest English word with no A-E-I-O-U! Y acts as the vowel here."},
      {type:"spell", prompt:"pronunciation", hint:"The way a word is said out loud. (Lose the O from 'pronounce')", answer:"pronunciation",
       explain:"P-R-O-N-U-N-C-I-A-T-I-O-N. From 'pronounce' but the O becomes U! Pro-nun-ciation, not pro-noun-ciation."},
      {type:"spell", prompt:"questionnaire", hint:"A form full of questions to answer.", answer:"questionnaire",
       explain:"Q-U-E-S-T-I-O-N-N-A-I-R-E. Two N's! From French. Think: question + naire."},
      {type:"choose", prompt:"Thank you for your good ____.",
       options:["advice (noun — the suggestion)","advise (verb — to give advice)"], answer:"advice (noun — the suggestion)",
       explain:"ADVICE (with C) = noun, the suggestion itself. ADVISE (with S) = verb, the action of giving advice. 'Your advice' — it's a thing you own."},
    ]
  },
  11: {
    name: "Sentence Builder",
    realm: "Tower of Eloquence",
    desc: "Put words in the right order to make good sentences!",
    rounds: [
      {type:"order", words:"yesterday / to / went / I / the / park",
       hint:"Start with who did it (I), then what they did.",
       right:"I went to the park yesterday.",
       explain:"English order: Who (I) + did what (went) + where (to the park) + when (yesterday)."},
      {type:"order", words:"doesn't / she / coffee / like",
       hint:"Start with the person (she), then the action.",
       right:"She doesn't like coffee.",
       explain:"Person (she) + helping verb (doesn't) + main verb (like) + what (coffee)."},
      {type:"order", words:"beautiful / a / she / dress / wearing / is",
       hint:"Describing words go before the thing they describe.",
       right:"She is wearing a beautiful dress.",
       explain:"Person + is wearing + a + describing word + thing. 'A beautiful dress' — the describing word goes right before the thing."},
      {type:"order", words:"have / you / ever / to / been / London",
       hint:"This is a question — start with 'have'.",
       right:"Have you ever been to London?",
       explain:"Questions flip the order! Have + person + ever + action + place."},
      {type:"order", words:"because / late / bus / the / was / I / was / late",
       hint:"Main part first, then the reason with 'because'.",
       right:"I was late because the bus was late.",
       explain:"Main idea first (I was late) + because + reason (the bus was late)."},
      {type:"order", words:"if / rains / it / will / stay / I / home / at",
       hint:"Start with 'if' and what might happen, then what you'll do.",
       right:"If it rains, I will stay at home.",
       explain:"If + condition (it rains) + comma + result (I will stay at home)."},
      {type:"order", words:"never / I / seen / have / such / beautiful / a / sunset",
       hint:"Person first, then 'have', then 'never', then the action.",
       right:"I have never seen such a beautiful sunset.",
       explain:"I + have + never + seen + rest. 'Never' goes between 'have' and the action word."},
      {type:"order", words:"despite / rain / the / went / they / outside",
       hint:"'Despite' goes at the very beginning.",
       right:"Despite the rain, they went outside.",
       explain:"Despite + problem + comma + what happened anyway."},
    ]
  },
  12: {
    name: "Common Confusions",
    realm: "Tower of Eloquence",
    desc: "Words that people mix up all the time. Learn the difference!",
    rounds: [
      {type:"choose", prompt:"This will ____ your final grade.",
       options:["affect (change)","effect (result)"], answer:"affect (change)",
       explain:"AFFECT = verb (action). EFFECT = noun (thing). 'Will affect' — needs an action word, so AFFECT."},
      {type:"choose", prompt:"The new law had a big ____.",
       options:["effect (result)","affect (change)"], answer:"effect (result)",
       explain:"EFFECT = noun (the result). 'Had a big effect' — effect is a thing you can have."},
      {type:"choose", prompt:"She is ____ than her brother.",
       options:["taller","more tall"], answer:"taller",
       explain:"Short words (one part) use -ER: tall-er, big-ger, fast-er. 'More tall' sounds strange!"},
      {type:"choose", prompt:"This is the ____ movie I have ever seen.",
       options:["most interesting","interestingest"], answer:"most interesting",
       explain:"Long words (many parts) use MOST: most interesting, most beautiful. Never put -EST on long words!"},
      {type:"choose", prompt:"I have ____ finished my homework.",
       options:["already (before now)","all ready (completely prepared)"], answer:"already (before now)",
       explain:"ALREADY = before now (one word). ALL READY = completely prepared (two words)."},
      {type:"choose", prompt:"We are ____ to leave now.",
       options:["all ready (prepared)","already (before now)"], answer:"all ready (prepared)",
       explain:"ALL READY = everyone is prepared. Two words meaning completely ready!"},
      {type:"choose", prompt:"I need to ____ down and rest.",
       options:["lie (recline yourself)","lay (put something down)"], answer:"lie (recline yourself)",
       explain:"LIE = you do it to yourself (lie down). LAY = you do it to an object (lay the book down)."},
      {type:"choose", prompt:"____ the book on the table please.",
       options:["Lay (put something down)","Lie (recline)"], answer:"Lay (put something down)",
       explain:"LAY = to put an object down. You LAY the book (object). You LIE down (yourself)."},
    ]
  },
  13: {
    name: "Paragraph Power",
    realm: "Kingdom of Fluent Writing",
    desc: "Write short paragraphs from fun prompts!",
    rounds: [
      {type:"write", prompt:"Describe your perfect day in 2 or 3 sentences.",
       keywords:["morning","friends","happy","food"],
       explain:"Try to use some of these words: morning, friends, happy, food. Start each sentence with a capital letter!"},
      {type:"choice_moment",
       prompt:"The royal herald presents two quills. 'The silver quill writes in careful, measured prose. The gold quill writes in bold, adventurous language. Which feels more like you?'",
       options:[
         ["Take the silver quill — thoughtful and precise","silver"],
         ["Take the gold quill — bold and spirited","gold"]
       ],
       result:"The herald bows. 'A fine choice. Now — the garden awaits your words.'"},
      {type:"write", prompt:"Write 2 or 3 sentences about your favorite animal.",
       keywords:["animal","like","because","color"],
       explain:"Use BECAUSE to give reasons. Check that you spelled BECAUSE correctly!"},
      {type:"write", prompt:"Describe a person you like in 2 or 3 sentences.",
       keywords:["kind","help","always","friend"],
       explain:"Watch out for YOUR vs YOU'RE. YOUR friend = your own friend. YOU'RE = you are."},
    ]
  },
  14: {
    name: "Story Seeds",
    realm: "Kingdom of Fluent Writing",
    desc: "Continue a story from a starting sentence. Be creative!",
    rounds: [
      {type:"story", prompt:"The door opened slowly, and I saw something I had never seen before...",
       min_sentences:3,
       explain:"Write at least 3 sentences to continue this story. Use past tense (opened, saw, walked)."},
      {type:"story", prompt:"I woke up to a strange sound coming from the kitchen...",
       min_sentences:3,
       explain:"What happens next? Write at least 3 sentences. Use interesting action words like crept, whispered, rushed."},
      {type:"story", prompt:"If I could travel anywhere in the world, I would go to...",
       min_sentences:3,
       explain:"Complete the thought! Where would you go and why? Use WOULD and COULD correctly."},
    ]
  },
  15: {
    name: "Free Writing",
    realm: "Kingdom of Fluent Writing",
    desc: "The final challenge! Write freely about what you've learned.",
    rounds: [
      {type:"essay", prompt:"In 4 or 5 sentences, tell us what you have learned in SpellQuest!",
       explain:"This is your final quest! Show everything you've learned. Use correct spelling, good grammar, and complete sentences. You've come so far - show what you can do!"},
    ]
  },
};

const ACHIEVEMENTS = {
  first_steps:       "First Steps - Complete Level 1",
  village_master:    "Village Master - Finish all Village of Letters levels",
  forest_guide:      "Forest Guide - Finish all Forest of Sounds levels",
  mountain_climber:  "Mountain Climber - Finish all Mountain of Mastery levels",
  tower_scholar:     "Tower Scholar - Finish all Tower of Eloquence levels",
  kingdom_scribe:    "Kingdom Scribe - Finish every single level!",
  perfect_round:     "Perfect Round - Get every answer right in one level",
  streak_3:          "Hot Streak - Get 3 answers right in a row",
  streak_5:          "On Fire! - Get 5 answers right in a row",
  streak_10:         "Unstoppable! - Get 10 answers right in a row",
  comeback:          "Comeback Kid - After a wrong answer, get the next 3 right",
  hundred_gems:      "Gem Collector - Earn 100 total gems",
  five_hundred_gems: "Gem Hoarder - Earn 500 total gems",
  thousand_gems:     "Gem Vault - Earn 1000 total gems",
};

const RANKS = [
  [0,    "Letter Learner"],
  [50,   "Word Apprentice"],
  [150,  "Spelling Scout"],
  [300,  "Grammar Guard"],
  [500,  "Sentence Knight"],
  [750,  "Paragraph Paladin"],
  [1000, "Writing Wizard"],
  [1500, "Language Lord"],
  [2500, "English Emperor"],
];

const BONUS_GAMES = {
  simon: {
    name: "Word Simon",
    cost: 60,
    required_level: 3,
    desc: "A memory-challenge in the Echo Chamber beneath the village. The chamber speaks a sequence of words — repeat them back perfectly and the ancient echoes will reward you with gems.",
    locked_desc: "A sealed door in the village basement hums with echoes. You hear faint words repeating — something inside tests memory.",
    flavor: "You descend stone steps into a circular chamber. Crystals embedded in the walls pulse with each spoken word. A deep voice fills the room, reciting words one by one. The echoes will judge your recall.",
  },
  bomb: {
    name: "Typing Bomb",
    cost: 75,
    required_level: 6,
    desc: "The Gnomish Workshop's most dangerous invention: a ticking word-bomb that can only be disarmed by typing a chain of words before the fuse runs out. Speed and accuracy together!",
    locked_desc: "Behind a heavy iron door, something ticks. A gnome's warning sign reads: 'SPEED TYPING REQUIRED. ENTER AT YOUR OWN RISK.'",
    flavor: "The gnome inventor grins nervously as you enter. 'Right — see that glowing sphere? It's rigged to a timer. Type the words I give you before the fuse burns down, and the bomb powers off. Ready?' Sparks fly as the timer begins.",
  },
  robot: {
    name: "Robot Reactor",
    cost: 90,
    required_level: 11,
    desc: "A lonely word-robot in the tower basement needs correctly ordered sentences to charge its reactor core. Feed it good grammar and watch it light up the room!",
    locked_desc: "A dusty maintenance hatch in the tower basement is marked 'REACTOR CHAMBER — AUTHORIZED WORDSMITHS ONLY.' A faint mechanical hum seeps through the cracks.",
    flavor: "You duck through the hatch into a chamber of humming pipes. A robot with friendly glowing eyes sits in the center, its reactor core dim and flickering. 'Input sentence,' it beeps hopefully. 'Core charge level: critical!'",
  },
};

const REALM_SCENES = {
  "Village of Letters": [
    ["Town Gate",
     "A cobblestone road stretches ahead, lined with bright market stalls. Above the gate, carved letters glow softly: 'Welcome, young speller.' A friendly innkeeper waves from across the square. Simple word-magic drifts through the air like warm bread-scent — easy to catch, eager to be used."],
    ["Lantern Lane",
     "The sun dips lower and lanterns flicker to life one by one along the lane. Each lamp post holds a wooden sign with a half-written word, waiting for someone to finish it. A tabby cat winds between your ankles, purring whenever you spell something correctly."],
    ["Mayor's Square",
     "The heart of the village bustles with merchants, children, and town criers. The Mayor's fountain statue — a quill pen taller than a person — stands in the center. Villagers gather around, eager to see if you can pass the final spelling tests and earn your way forward."],
  ],
  "Forest of Sounds": [
    ["Whispering Trail",
     "The trees here are taller than any tower, their trunks wrapped in moss that seems to murmur. Every footstep makes a leaf rustle with a different letter-sound: shhh, thhh, whhh. Somewhere in the distance an owl coos in perfect rhythm, as if keeping time for a spelling song."],
    ["Riddle Bridge",
     "A rope bridge sways over a misty chasm. A hooded traveler stands at its center, blocking the way. 'Cross if you can,' the figure intones, 'but first untangle the words I've been given.' Paper scraps drift on the wind, each carrying a fragment of a tricky puzzle."],
    ["Echo Grove",
     "You reach the silent heart of the forest — an ancient ring of oaks where sound behaves strangely. Words spoken here echo back in reverse, and only those who truly understand a word's shape can make their voice carry true. The grove itself seems to be testing your ears and your nerve."],
  ],
  "Mountain of Mastery": [
    ["Stone Pass",
     "The path narrows to a ledge carved into the mountainside. Cold wind bites at your cheeks. Runestones are embedded in the rock wall — each one demands a correct answer before it'll release a handhold. One wrong move and loose pebbles skitter into the gorge below."],
    ["Old Hermit Camp",
     "A tiny hut clings to a plateau, smoke curling from its chimney. An old hermit with ink-stained fingers sits at a wooden table, surrounded by stacks of parchment. 'Ah, another climber!' she cackles. 'Sit. Help me sort these dreadful sentences and I'll point you toward the summit.'"],
    ["Summit Steps",
     "The final staircase is carved from living crystal, every step inscribed with a word that grown-ups still get wrong. Storm clouds gather overhead. Each correct answer lights one more step beneath your feet. The peak is so close you can taste the thin, bright air."],
  ],
  "Tower of Eloquence": [
    ["Archive Hall",
     "The great oak doors swing open onto a circular room that stretches upward farther than torchlight can reach. Spiral shelves are packed with books in every language ever written. A librarian — tall, silent, made entirely of stacked scrolls — gestures toward your first challenge."],
    ["Clockwork Gallery",
     "Gears, levers, and brass keys fill this strange chamber. Every machine is powered by sentences: a gramophone that plays only when fed proper grammar, a puppet that acts out stories told in the right tense, a door that swings open when you speak a complete thought."],
    ["Sky Library",
     "You emerge onto a balcony so high that clouds pass beneath your feet. Books float freely here, their pages turning in the wind like wings. A quill pen hovers in the air before you, waiting. This is where the most precise, most beautiful language lives — and it wants to hear yours."],
  ],
  "Kingdom of Fluent Writing": [
    ["Garden of Ideas",
     "A garden unlike any other: flowers bloom in the exact color of the last word spoken near them, and sentences hang from trellises like vines. Every path is a paragraph, every fountain a topic waiting for your thoughts. Ideas sprout so fast here you can barely keep up."],
    ["Story Road",
     "A winding road paved with — of all things — pages torn from great books. Characters from half-finished tales wave from the roadside: a knight missing an ending, a dragon needing a description, a princess waiting for the next chapter. They all want to be part of YOUR story."],
    ["Royal Hall",
     "The throne room glitters with the light of a thousand completed stories. The King and Queen of Fluent Writing sit side by side, not on golden thrones but on tall stacks of well-written books. They rise as you enter. 'Speak,' says the Queen, 'in your own voice. Show us everything you have become.'"],
  ],
};

const REALM_ENTRY = {
  "Village of Letters": [
    "The Village of Letters",
    "You emerge from the Traveler's Gate into the Village of Letters. This is where every speller starts — a cheerful, bustling place where words are short and friendly and the townsfolk love to help newcomers. The air smells of fresh bread and ink. Every sign, every stall, every cobblestone hums with simple word-magic.\n\nA village elder approaches. 'Welcome, traveler! Here you'll learn the building blocks — short words, clear sounds, and the joy of getting it right. Complete three levels here and you'll earn the Village Master title.'"
  ],
  "Forest of Sounds": [
    "The Forest of Sounds",
    "The path out of the village leads into a dense, whispering woodland. The Forest of Sounds is older than any map — a place where letters hide inside words without making a peep, where two words can sound identical but mean completely different things, and where every rustling leaf carries a lesson in listening carefully.\n\nA fox with silver-tipped ears trots up beside you. 'The forest doesn't test your memory,' she says. 'It tests your ears. Silent letters, sneaky homophones, and spelling patterns that look wrong but sound right. Trust your ears — but double-check with your brain.'"
  ],
  "Mountain of Mastery": [
    "The Mountain of Mastery",
    "The trees thin out and the ground rises sharply. Before you looms the Mountain of Mastery — grey stone, sheer cliffs, and the kind of cold wind that makes you glad you packed a cloak. The words here are the ones that trip up even the cleverest spellers: government, necessary, separate. This is where you prove you don't just guess — you know.\n\nA mountain goat with a surprisingly scholarly air picks its way down to greet you. 'Up here,' it says, 'the air is thin and the words are thick. Grammar mistakes become avalanches. Spelling slips become lost footholds. But every summit you reach will make you nearly unstoppable.'"
  ],
  "Tower of Eloquence": [
    "The Tower of Eloquence",
    "A single spire pierces the clouds ahead — the Tower of Eloquence, built by the first writers who ever put quill to parchment. Its stones are mortared with precise vocabulary and polished syntax. Inside, every challenge is about saying exactly what you mean, not approximately what you meant.\n\nThe tower's clockwork owl — a brass-and-leather contraption — flutters down to your shoulder. 'Precision,' it ticks. 'That is the lesson of this tower. Advanced vocabulary, sentence order, and the small choices that separate good writing from great writing. The tower respects accuracy above all.'"
  ],
  "Kingdom of Fluent Writing": [
    "The Kingdom of Fluent Writing",
    "The tower's topmost door opens not onto a landing, but onto a sweeping green plain beneath a golden sky. You have reached the Kingdom of Fluent Writing — the final realm, where all the rules you've learned become tools rather than tests. Here, the challenge is not correctness but voice: your voice, your stories, your ideas, set free.\n\nA royal herald in silver-and-purple livery unfurls a scroll. 'Welcome to the kingdom! No more isolated drills. Here you will build paragraphs, grow stories from seeds, and finally speak in your own words about everything you have learned. This is the realm where you become not just a speller, but a WRITER.'"
  ],
};

const REALM_FAREWELL = {
  "Village of Letters": [
    "The Village Elder",
    "The village elder finds you near the Mayor's Fountain, a proud smile on their weathered face. 'Three levels complete! You arrived knowing nothing of this world, and now you walk out with the building blocks of every word you'll ever need. The Village of Letters will always be your home realm — come back anytime you need to remember where it all began.'\n\nThe elder presses a small carved token into your hand. 'Take this to the Forest. The fox will know what it means.'"
  ],
  "Forest of Sounds": [
    "The Silver Fox",
    "The fox with silver-tipped ears pads silently out of the trees as you reach the forest's far edge. 'Three levels,' she says, 'and you didn't let the silent letters fool you once. You can hear the difference between THERE and THEIR now. You know when a K is sneaky and when a GH is quiet. The Forest doesn't teach — it whispers. And you learned to listen.'\n\nShe flicks her tail toward the mountain. 'The goat's waiting. Tell her the fox sends her best listeners.'"
  ],
  "Mountain of Mastery": [
    "The Mountain Goat",
    "The scholarly goat stands on an outcrop, silhouetted against the clouds. 'Government. Necessary. Separate. Independent.' She recites the mountain's hardest words like a poem. 'These are the ones that break most climbers. But not you. You fixed broken grammar and spotted every trap. The summit is yours.'\n\nShe gestures with one hoof toward a distant spire. 'The Tower of Eloquence doesn't care about right and wrong — it cares about precision. The owl will test that now. Good luck, climber.'"
  ],
  "Tower of Eloquence": [
    "The Clockwork Owl",
    "The brass owl settles on the tower's highest windowsill, its gears clicking contentedly. 'Three levels of precision,' it ticks. 'You distinguished affect from effect. You spelled questionnaire correctly. You ordered scrambled sentences into clean prose. The Tower is satisfied.'\n\nIts mechanical eyes whir brighter. 'Only one realm remains — the Kingdom. The herald will ask for your voice, not your correctness. Don't be afraid to use it.'"
  ],
  "Kingdom of Fluent Writing": [
    "The Royal Herald",
    "The herald in silver-and-purple unrolls a scroll so long it pools at their feet. 'The Kingdom's three trials are complete. You grew stories from seeds. You built paragraphs from ideas. And in the Great Hall of Reflection, you spoke in your own voice — not to prove a fact, but to share what you have become.'\n\nThey look up with shining eyes. 'You arrived in the Village of Letters as a traveler. You leave the Kingdom of Fluent Writing as a WRITER. The world of SpellQuest will remember your name.'"
  ],
};

const CHALLENGE_SCENES = {
  spell: "A glowing rune-lock hovers in the air. Someone has sealed this passage with word-magic — only the correct spelling will break the seal.",
  choose: "A confused traveler wrings their hands nearby, staring at a handful of similar-looking word-scrolls. 'Please,' they whisper, 'which one is right?'",
  fix: "The path ahead is blocked by a cracked sentence-stone, its grammar split down the middle. Repair it with the right words and the crack will mend itself.",
  order: "Jumbled word-gears float in the air, spinning uselessly. Push them into the right order and the mechanism will click into place.",
  write: "An ancient journal materializes before you, its pages blank. A gentle voice asks you to share a piece of your own world — in your own words.",
  story: "A campfire flickers at the roadside. Around it sit travelers with unfinished tales. One turns to you and says, 'We need an ending. Will you tell us what happens next?'",
  essay: "The Great Hall of Reflection opens before you. A single lectern stands in its center. This is where you speak freely — not to prove a fact, but to share what you have become through this journey.",
  choice_moment: "The path splits ahead. You can go either way — both will test your skills, but the flavor of the journey changes with your choice.",
};

const REALM_ORDER = [
  "Village of Letters", "Forest of Sounds", "Mountain of Mastery",
  "Tower of Eloquence", "Kingdom of Fluent Writing",
];

if (typeof window !== "undefined") {
  window.SpellQuestData = {
    LEVEL_DATA,
    ACHIEVEMENTS,
    RANKS,
    BONUS_GAMES,
    REALM_SCENES,
    REALM_ENTRY,
    REALM_FAREWELL,
    CHALLENGE_SCENES,
    REALM_ORDER,
  };
}
