import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
} from '@angular/core';
import { from, BehaviorSubject, interval, of, Subject, catchError } from 'rxjs';
import { takeUntil, takeWhile, map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'hello',
  template: `<h1>Hello {{name}}!</h1><h2>{{status | async}}</h2><button (click)=clickit()>clickit</button>`,
  styles: [`h1 { font-family: Lato; }`],
})
export class HelloComponent {
  @Input() stop: boolean;
  @Input() name: string;
  @Output() status: EventEmitter<number> = new EventEmitter();
  n = 0;
  stop$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnChanges(changes: SimpleChange) {
    console.log('changes', changes);
  }

  ngOnInit() {
    // ok to uncomment
    // setInterval(() => this.increment(), 1000);

    const stop = of(this.stop).pipe(
      tap(),
      map((m) => m)
    );

    // const stop2 = of(this.stop2).pipe(
    //   tap(),
    //   map((m) => m)
    // );

    this.status.subscribe((status) => {
      console.log('status', status);
    });

    // ok to uncomment
    // interval(1000)
    //   .pipe(takeUntil(this.stop$.pipe(filter((m) => m === true))))
    //   .subscribe((x) => console.log('I', x));

    this.errorTest();
  }

  clickit() {
    console.log('clickit');
    this.stop$.next(true);
  }

  increment() {
    // console.log(this.n);
    this.n += 1;
    this.status.emit(this.n);
  }

  errorTest() {
    const stream$ = from(['5', '10', '6', 'Hello', '2']);
    stream$
      .pipe(
        map((value) => {
          if (isNaN(value as any)) {
            throw new Error('This is not a number');
          }
          return parseInt(value);
        })
        // catchError((error) => {
        //   console.log('Caught Error', error);
        //   return of();
        // })
      )
      .subscribe({
        next: (res) => console.log('Value Emitted', res),
        error: (err) => console.log('Error Occurred', err),
        complete: () => console.log('Stream Completed'),
      });
  }
}
