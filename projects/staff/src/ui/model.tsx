import zustand from 'zustand';
import { z } from 'zod';
import { ticketData } from '@kenthackenough/server/data';
import { createRouteParameter } from '@kenthackenough/react/hooks';
import { Box, Modal, ScrollArea, Text, ModalProps } from '@mantine/core';
import { useRef } from 'react';


/** @export 'helpers/model' */

type ModelControllerConfig = {
    name: string,
    schema: z.AnyZodObject,
}

type UseModel<Config extends ModelControllerConfig> = {
    queryParam: ReturnType<typeof createRouteParameter>;
    opened?: string;
    open(id: string): void;
    close(): void;
}

type ModelRenderFunction<Config extends ModelControllerConfig> = (props: ReturnType<ModelController<Config>['getProps']>) => JSX.Element;

export class ModelController<Config extends ModelControllerConfig> {

    public store = zustand<UseModel<Config>>(set => ({
        queryParam: createRouteParameter({
            name: this.config.name,
            type: String,
            back: true,
        }),
        open(id) {
            set(state => {
                state.queryParam.setState({ value: id })
                return {}
            });
        },
        close() {
            set(state => {
                state.queryParam.setState({ value: undefined })
                return {}
            });
        },
    }))

    constructor(public config: Config & {
        title?: (props: Parameters<ModelRenderFunction<Config>>[0]) => JSX.Element;
    }, public render: ModelRenderFunction<Config>) {
        const self = this;
        // @ts-ignore
        // eslint-disable-next-line react/display-name
        this.Modal = (props: Parameters<typeof ControllerModal>[0]) => {
            const modelProps = self.getProps();
            return <ControllerModal {...props} controller={self} modelProps={modelProps} />
        }
    }

    public open = this.store.getState().open;
    public close = this.store.getState().close;
    public use = this.store;

    public getProps() {
        const id = this.store(o => o.queryParam)(o => o.value) as string;
        return {
            id,
            opened: Boolean(id),
            ...this.config,
        }
    }

    public Modal: (props: Partial<Omit<Parameters<typeof ControllerModal>[0], 'controller' | 'opened'>>) => JSX.Element;

}


function ControllerModal<Config extends ModelControllerConfig>(props: {
    controller: ModelController<Config>
    modelProps: ReturnType<ModelController<Config>['getProps']>
} & ModalProps) {
    const { controller, modelProps, ...rest } = props;
    const { id } = modelProps;
    // const id = controller.store(o => o.queryParam)(o => o.value);
    const close = controller.store(o => o.close);
    const opened = Boolean(id);

    const _id = useRef(id || '');
    if (opened) _id.current = id!;

    const Render = controller.render;
    const title = controller.config?.title ? controller.config.title(modelProps) : undefined;


    return <Modal {...rest} title={title} opened={opened} onClose={() => close()} styles={() => ({
        title: {
            flexGrow: 1
        }
    })}>
        <Render {...modelProps} />
    </Modal>
}


// const TicketModel = new ModelController({
//     name: 'ticket',
//     schema: ticketData,
// })

// TicketModel.open('123')

