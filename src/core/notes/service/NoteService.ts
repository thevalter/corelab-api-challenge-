import NoteCase from "../../shared/NoteCase";
import Note from "../model/Note";
import NotesRepository from "./NoteRepository";
import * as yup from 'yup';

export type Response = {
    message?: string | yup.ValidationError,
    data?: Note | Note[] | string,
    code: number
}
export default class NoteService implements NoteCase<Note | string | number, Response> {
    constructor(readonly repository: NotesRepository) { }

    async get() {
        const response = await this.repository.get();

        return {
            data: response,
            code: 200
        }
    }

    async getById(id: number): Promise<Response> {
        const response = await this.repository.getById(id);

        if (!response) {
            return {
                message: "Note does not exists",
                code: 404
            }
        }

        return {
            data: response,
            code: 200
        }
    }

    async getOne(title: string): Promise<Response> {
        const response = await this.repository.getOne(title);

        if (!response) {
            return {
                message: "Note does not exists",
                code: 404
            }
        }

        return {
            data: response,
            code: 200
        }
    }

    async getByColor(color: string): Promise<Response> {
        const response = await this.repository.getByColor(color);

        if (!response.length) {
            return {
                message: "This color does not exists",
                code: 404
            }
        }

        return {
            data: response,
            code: 200
        }
    }

    async post(data: Note): Promise<Response> {
        const noteExists = await this.repository.getOne(data.title);

        if (noteExists) {
            return {
                message: "Note already exists",
                code: 422
            };
        }

        try {
            const note = await this.repository.post(data);

            return {
                data: note,
                code: 201
            };
        } catch (error) {
            const yupError = error as yup.ValidationError;

            return {
                message: yupError,
                code: 500
            };
        }
    }

    async put(id: number, data: Note): Promise<Response> {

        const { title, desc, color, favorite } = data;

        if (!this.repository.getOne(title)) {
            return {
                message: "User does not exists",
                code: 404
            };
        }

        try {
            const note = await this.repository.put(id, { title, desc, color, favorite })

            return {
                data: note,
                code: 200
            };
        } catch (error) {
            const yupError = error as yup.ValidationError;

            return {
                message: yupError,
                code: 500
            };
        }
    }

    async delete(id: number): Promise<Response> {

        const note = await this.repository.getById(id);

        if (!note) {
            return {
                message: "Note does not exists",
                code: 404
            }
        }

        const response = await this.repository.delete(id);

        return {
            data: response,
            code: 200
        };
    }
}