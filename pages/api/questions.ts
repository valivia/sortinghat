import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import question from "../../types/question";

export default function questions(req: NextApiRequest, res: NextApiResponse) {
    const questions = [
        {
            "question": "Ben je meer een soft of -hardware persoon?",
            "options": [
                { "name": "Software all the way!", "value": "0/0/10/0" },
                { "name": "Mijn 'Hart' ligt bij hardware", "value": "0/5/0/10" },
                { "name": "Het heeft allebei wel wat", "value": "0/3/5/5" }
            ]
        },
        {
            "question": "Jouw droomwerkgever is: ",
            "options": [
                { "name": "Google", "value": "3/3/8/3" },
                { "name": "De Politie", "value": "0/10/0/0" },
                { "name": "Een klein lokaal bedrijf", "value": "5/5/5/5" },
                { "name": "Ik wil later voor mezelf werken", "value": "5/5/5/5" }
            ]
        },

        {
            "question": "Je koelkast is leeg. Wat doe je?",
            "options": [
                { "name": "Je schrijft een programma die automatisch nieuwe producten besteld", "value": "2/0/10/2" },
                { "name": "Je maakt een spreadsheet aan zodat je voortaan goed bij kan houden wat je nog hebt", "value": "10/0/0/2" },
                { "name": "Je gaat opzoek naar bewijsmateriaal voor de dader", "value": "0/10/0/0" },
                { "name": "Je stuurt een bericht in de famile WhatsApp groep, waarbij je iedereen beschuldigt", "value": "0/0/0/10" }
            ]
        }
    ] as question[]


    res.json(questions);
}