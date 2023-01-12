import zustand from 'zustand';
import { z } from 'zod';
import { ticketData } from '@kenthackenough/server/data';
import { createRouteParameter } from '@kenthackenough/react/hooks';
import { Box } from '@mantine/core';


/** @export 'helpers/model' */

type ModelControllerConfig = {
    name: string,
    schema: z.AnyZodObject
}

type UseModel<Config extends ModelControllerConfig> = {
    opened?: string;
    open(id: string): void;
    close(): void;
}

export class ModelController<Config extends ModelControllerConfig> {

    public queryParam = createRouteParameter({
        name: this.config.name,
        type: String,
    })

    public store = zustand<UseModel<Config>>(set => ({
        open(id) {
            this.queryParam.setState({ value: id })
        },
        close() {
            this.queryParam.setState({ value: undefined })
        },
    }))

    constructor(public config: Config) {

    }

    public open = this.store.getState().open;
    public close = this.store.getState().close;

    public Modal() {
        const id = this.queryParam(o => o.value);

        return <Box>
            {this.config.name} {id}
        </Box>
    }

}

// const TicketModel = new ModelController({
//     name: 'ticket',
//     schema: ticketData,
// })

// TicketModel.open('123')

