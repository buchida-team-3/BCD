import os
import subprocess
import time

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class Target:
    """
    watchDir에 감시하려는 디렉토리를 명시
    os.getcwd()는 현재 디렉토리를 반환
    -> watchDir = os.getcwd()
    """
    # 현재 디렉토리의 하위 디렉토리인 samples를 감시
    watchDir = os.path.join(os.path.dirname(__file__), 'samples')

    def __init__(self):
        self.observer = Observer()   #observer객체를 만듦

    def run(self):
        event_handler = Handler()
        self.observer.schedule(event_handler, self.watchDir, 
                                                       recursive=True)
        self.observer.start()
        try:
            while True:
                time.sleep(1)
        except:
            self.observer.stop()
            print("Error")
            self.observer.join()

class Handler(FileSystemEventHandler):
#FileSystemEventHandler 클래스를 상속받음.
#아래 핸들러들을 오버라이드 함

    #파일, 디렉터리가 move 되거나 rename 되면 실행
    # def on_moved(self, event):
    #     print(event)


    def on_created(self, event): #파일, 디렉터리가 생성되면 실행
        # print(event)
        
        # 현재 스크립트의 상대 경로를 사용하여 main.py의 경로를 설정합니다.
        script_path = os.path.join(os.path.dirname(__file__), 'main.py')

        # subprocess를 사용하여 main.py를 실행합니다.
        result = subprocess.run(['python3', script_path, '-v', 'samples/sample_04'], capture_output=True, text=True)

        print("출력:\n",result.stdout if result.stdout else "(없음)")
        print("로그:\n",result.stderr if result.stderr else "(없음)")
        print("종료 상태:",result.returncode if result.returncode else "(없음)")
        
        
    # def on_deleted(self, event): #파일, 디렉터리가 삭제되면 실행
    #     print(event)


    # def on_modified(self, event): #파일, 디렉터리가 수정되면 실행
    #     print(event)


# if __name__ == "__main__": # 본 파일에서 실행될 때만 실행되도록 함
w = Target()
w.run()
