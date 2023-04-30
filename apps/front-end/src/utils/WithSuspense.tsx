import { ComponentType, Suspense } from "react";

export function WithSuspense(Component: React.FC, Loader: JSX.Element | null = null): JSX.Element {
    return <Suspense fallback={Loader}>
        <Component /> 
    </Suspense>
}

export function WithSuspenseHOC<TProps extends {}>  (Component: ComponentType<TProps>, Loader: JSX.Element | null = null) {
    return (props: TProps) => {
        return <Suspense fallback={Loader}>
            <Component {...props} /> 
        </Suspense>
    }
}