const fs = require("fs")
const pdfParse = require("pdf-parse")

const Syllabus = require("../models/Syllabus")
const client = require("../ai/openrouter")

// ========================================
// Upload & Structure Syllabus
// ========================================

const uploadSyllabus = async (req, res) => {
  try {
    // ------------------------------------
    // 1. Validate uploaded file
    // ------------------------------------

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a syllabus PDF.",
      })
    }

    const filePath = req.file.path

    // ------------------------------------
    // 2. Read PDF
    // ------------------------------------

    const dataBuffer =
      fs.readFileSync(filePath)

    const pdfData =
      await pdfParse(dataBuffer)

    const text =
      pdfData.text?.trim()

    if (!text) {
      return res.status(400).json({
        message:
          "Could not extract text from the PDF.",
      })
    }

    // ------------------------------------
    // 3. Limit text sent to AI
    // ------------------------------------
    //
    // We only need the syllabus structure.
    // Avoid sending unnecessarily large text.
    //

    const syllabusText =
      text.slice(0, 30000)

    // ------------------------------------
    // 4. Ask AI to structure syllabus
    // ------------------------------------

    const prompt = `
You are a syllabus structure extractor.

Convert the provided syllabus into this hierarchy:

Subject
  → Unit
    → Topic
      → Subtopic

Rules:

1. Preserve the original syllabus terminology.
2. Do not invent subjects, units, topics, or subtopics.
3. Do not add explanations.
4. Do not create a study plan.
5. Do not assign days.
6. Do not estimate study time.
7. Keep every important syllabus item.
8. If several concepts appear in one topic, split them into subtopics.
9. Preserve the original order.
10. Return ONLY valid JSON.

Required JSON structure:

{
  "subjects": [
    {
      "name": "Subject name",
      "units": [
        {
          "name": "Unit name",
          "topics": [
            {
              "name": "Topic name",
              "subtopics": [
                {
                  "name": "Subtopic name"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

SYLLABUS:

${syllabusText}
`

    const completion =
      await client.chat.completions.create({
        model:
          process.env.OPENROUTER_MODEL ||
          "openrouter/free",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0,

        max_tokens: 4000,
      })

    // ------------------------------------
    // 5. Get AI response
    // ------------------------------------

    let aiContent =
      completion.choices?.[0]?.message?.content

    if (!aiContent) {
      return res.status(502).json({
        message:
          "AI did not return a syllabus structure.",
      })
    }

    // ------------------------------------
    // 6. Clean possible markdown fences
    // ------------------------------------

    aiContent = aiContent
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    // ------------------------------------
    // 7. Parse JSON
    // ------------------------------------

    let structuredSyllabus

    try {
      structuredSyllabus =
        JSON.parse(aiContent)
    } catch (error) {
      console.error(
        "Invalid AI JSON:",
        aiContent
      )

      return res.status(502).json({
        message:
          "AI returned invalid syllabus JSON.",
      })
    }

    // ------------------------------------
    // 8. Validate structure
    // ------------------------------------

    if (
      !structuredSyllabus.subjects ||
      !Array.isArray(
        structuredSyllabus.subjects
      )
    ) {
      return res.status(502).json({
        message:
          "AI returned an invalid syllabus structure.",
      })
    }

    // ------------------------------------
    // 9. Normalize structure
    // ------------------------------------

    const subjects =
      structuredSyllabus.subjects.map(
        (subject) => ({
          name:
            String(
              subject.name || "Unnamed Subject"
            ).trim(),

          units:
            Array.isArray(subject.units)
              ? subject.units.map(
                  (unit) => ({
                    name:
                      String(
                        unit.name ||
                          "Unnamed Unit"
                      ).trim(),

                    topics:
                      Array.isArray(
                        unit.topics
                      )
                        ? unit.topics.map(
                            (topic) => ({
                              name:
                                String(
                                  topic.name ||
                                    "Unnamed Topic"
                                ).trim(),

                              subtopics:
                                Array.isArray(
                                  topic.subtopics
                                )
                                  ? topic.subtopics
                                      .map(
                                        (
                                          subtopic
                                        ) => ({
                                          name:
                                            String(
                                              subtopic.name ||
                                                ""
                                            ).trim(),

                                          completed:
                                            false,

                                          completedAt:
                                            null,

                                          mastery: 0,
                                        })
                                      )
                                      .filter(
                                        (
                                          subtopic
                                        ) =>
                                          subtopic.name
                                            .length >
                                          0
                                      )
                                  : [],

                              completed:
                                false,

                              completedAt:
                                null,

                              mastery: 0,
                            })
                          )
                        : [],

                    completed: false,

                    completedAt: null,
                  })
                )
              : [],
        })
      )

    // ------------------------------------
    // 10. Make sure something was extracted
    // ------------------------------------

    const hasUnits =
      subjects.some(
        (subject) =>
          subject.units.length > 0
      )

    if (!hasUnits) {
      return res.status(502).json({
        message:
          "No syllabus units were detected.",
      })
    }

    // ------------------------------------
    // 11. Save syllabus
    // ------------------------------------

    const syllabus =
      await Syllabus.create({
        user: req.user._id,

        title:
          req.file.originalname,

        content: text,

        subjects,
      })

    // ------------------------------------
    // 12. Response
    // ------------------------------------

    return res.status(201).json({
      message:
        "Syllabus uploaded and structured successfully.",

      syllabus,
    })
  } catch (error) {
    console.error(
      "Upload Syllabus Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

// ========================================
// Get My Syllabuses
// ========================================

const getMySyllabuses = async (req, res) => {
  try {
    const syllabuses =
      await Syllabus.find({
        user: req.user._id,
      })

    return res.status(200).json(
      syllabuses
    )
  } catch (error) {
    console.error(
      "Get Syllabuses Error:",
      error
    )

    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  uploadSyllabus,
  getMySyllabuses,
}