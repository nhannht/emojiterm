import React, {useState, useEffect} from 'react';
import {render, Text, Box} from 'ink';
import TextInput from 'ink-text-input';
import emojilib from 'emojilib' assert {type: 'json'};
import emojiDataJson from 'unicode-emoji-json' assert {type: 'json'};
import {uniq} from 'lodash';

for (const emo in emojiDataJson) {
    emojiDataJson[emo]['keywords'] = emojilib[emo]
}

const MyApp = () => {
    const [query, setQuery] = useState('cat');
    const [emojiData] = useState(emojiDataJson);

    const [currentEmoji, setCurrentEmoji] = useState('');
    const [countEmoji] = useState(Object.keys(emojiData).length);

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    useEffect(() => {
        // console.log(emojiData["✍️"].keywords.includes("writing_hand"))
        if (query.length > 0) {
            let result = []
            let q = query.trim().split(/\s+/);
            q = q.map((e) => e.toLowerCase())
            q = q.filter((e) => e.length > 1)
            Object.keys(emojiData).forEach((emo) => {
                for (let e of q) {
                    if (emojiData[emo].keywords) {
                        if (emojiData[emo].keywords.includes(e)) {
                            result.push(emo)
                        }
                    }
                    if (emojiData[emo].name.includes(e)) {
                        result.push(emo)
                    }
                }
            })
            if (result.length > 0) {
                setCurrentEmoji(shuffle(uniq(result)).slice(0, 20).join('').trim());
            } else {
                setCurrentEmoji("No emoji found")
            }
        } else if (query.length === 0) {
            setCurrentEmoji("")
        }
    }, [query])

    return (
        <Box
            flexDirection={"column"}
        >
            <Box justifyContent="center" marginBottom={2}>
                <Text>
                    Total {countEmoji} emojis
                </Text>
            </Box>

            <Box
                width={"100%"}
            >
                <Box
                    width={"50%"}
                    paddingLeft={2}
                >
                    <TextInput value={query} onChange={setQuery}
                               placeholder="Search for an emoji"/>
                </Box>
                <Box
                    width={"50%"}
                >
                    <Text color={"green"}>
                        {currentEmoji}
                    </Text>
                </Box>

            </Box>
        </Box>
    )
};


render(<React.StrictMode>
        <MyApp/>
    </React.StrictMode>
);

